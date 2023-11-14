import { type HierarchyNode } from 'd3-hierarchy'

export const getShouldRenderNodeAs = (
  props: GpsFilterNodeProps,
): {
  [key: string]: () => boolean
} => {
  const { node } = props as {
    node: HierarchyNode<GpsFilterItemNode>,
  }

  const title = () => {
    return (
      !props.isRootNode &&
      node.data.userSelection === 'leaves-only' &&
      node.height === 2
    )
  }

  const accordionAndChildren = () => {
    return (
      !props.isRootNode &&
      Boolean(node.children?.length) &&
      (
        node.data.userSelection === 'leaves-only' &&
        node.height === 1
      )
    )
  }

  const singleCheckbox = () => {
    return !props.isRootNode && (
      node.data.userSelection === 'leaves-only' &&
      node.height === 0 &&
      node.depth === 1
    )
  }

  const childrenInContainer = () => {
    return Boolean(node.children?.length) && !accordionAndChildren()
  }

  return {
    singleCheckbox,
    title,
    accordionAndChildren,
    childrenInContainer,
  }
}
