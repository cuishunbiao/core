import { effect, ReactiveEffect, trigger, track } from './effect'
import { TriggerOpTypes, TrackOpTypes } from './operations'
import { Ref } from './ref'
import { isFunction, NOOP } from '@vue/shared'
import { ReactiveFlags, toRaw } from './reactive'

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = (ctx?: any) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

class ComputedRefImpl<T> {
  //缓存结果值
  private _value!: T
  //是不是脏数据？
  private _dirty = true

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true;
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    //创建副作用函数
    this.effect = effect(getter, {
      //true 函数延迟执行
      lazy: true,
      //执行函数
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          //派发通知
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      }
    })

    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    //如果是脏数据，则需要执行副作用函数
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
    }
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue: T) {
    //设置新值
    this._setter(newValue)
  }
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  //定义 getter 和 setter
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>
  //先判断是否是函数？
  if (isFunction(getterOrOptions)) {
    //把我们写的 computed函数 赋值给 getter
    getter = getterOrOptions
    //如果是开发环境赋值 一个包含错误信息的函数，如果是生产环境，赋值一个空函数
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    //如果我们是以第二种方式传入的参数，那就直接赋值对应的 getter 和 setter
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  //返回一个类，收集依赖、派发事件
  return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
  ) as any
}
