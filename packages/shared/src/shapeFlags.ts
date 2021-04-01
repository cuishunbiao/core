export const enum ShapeFlags {
  ELEMENT = 1, //emement
  FUNCTIONAL_COMPONENT = 1 << 1, //functional_component 2
  STATEFUL_COMPONENT = 1 << 2, //stateful_component 4
  TEXT_CHILDREN = 1 << 3, //text_children8
  ARRAY_CHILDREN = 1 << 4, //array_children 16
  SLOTS_CHILDREN = 1 << 5, //slots_children 32
  TELEPORT = 1 << 6, // teleport 64
  SUSPENSE = 1 << 7, // suspense 128
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, //component_should_keep_alive 256
  COMPONENT_KEPT_ALIVE = 1 << 9, //component_keep_alive 512
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
