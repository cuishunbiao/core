import {
  computed as _computed,
  ComputedRef,
  WritableComputedOptions,
  WritableComputedRef,
  ComputedGetter
} from '@vue/reactivity'
import { recordInstanceBoundEffect } from './component'

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  debugger
  //初始化 getter、setter 和 副作用函数
  const c = _computed(getterOrOptions as any)
  //整理当前实例的副作用函数
  debugger
  recordInstanceBoundEffect(c.effect)
  return c
}
