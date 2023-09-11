import {
  type HierarchyNode,
} from 'd3-hierarchy'

describe('getShouldRenderNodeAs', () => {
  it('detects whether to render node as checkbox', () => {
    const props1 = {
      isRootNode: false,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const props2 = {
      isRootNode: true,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const node1 = {
      data: {
        userSelection: 'all-nodes',
      } as GpsFilterItemNode,
      height: 0,
    } as HierarchyNode<GpsFilterItemNode>

    const node2 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 0,
    } as HierarchyNode<GpsFilterItemNode>

    const node3 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 1,
    } as HierarchyNode<GpsFilterItemNode>

    const node4 = {
      data: {
        userSelection: 'all-nodes',
      } as GpsFilterItemNode,
      height: 2,
    } as HierarchyNode<GpsFilterItemNode>

    const result1 = getShouldRenderNodeAs({ ...props1, node: node1 }).checkbox()
    const result2 = getShouldRenderNodeAs({ ...props1, node: node2 }).checkbox()
    const result3 = getShouldRenderNodeAs({ ...props1, node: node3 }).checkbox()
    const result4 = getShouldRenderNodeAs({ ...props1, node: node4 }).checkbox()
    const result5 = getShouldRenderNodeAs({ ...props2, node: node1 }).checkbox()

    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(false)
    expect(result4).toBe(true)
    expect(result5).toBe(false)
  })

  it('detects whether to render node as radio', () => {
    const props1 = {
      isRootNode: false,
      dataCombination: 'unique',
    } as GpsFilterNodeProps

    const props2 = {
      isRootNode: true,
      dataCombination: 'unique',
    } as GpsFilterNodeProps

    const props3 = {
      isRootNode: false,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const node1 = {
      data: {
        userSelection: 'single-node',
      } as GpsFilterItemNode,
      height: 0,
    } as HierarchyNode<GpsFilterItemNode>

    const node2 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 0,
    } as HierarchyNode<GpsFilterItemNode>

    const node3 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 1,
    } as HierarchyNode<GpsFilterItemNode>

    const result1 = getShouldRenderNodeAs({ ...props1, node: node1 }).radio()
    const result2 = getShouldRenderNodeAs({ ...props1, node: node2 }).radio()
    const result3 = getShouldRenderNodeAs({ ...props1, node: node3 }).radio()
    const result4 = getShouldRenderNodeAs({ ...props2, node: node1 }).radio()
    const result5 = getShouldRenderNodeAs({ ...props3, node: node2 }).radio()

    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(false)
    expect(result4).toBe(false)
    expect(result5).toBe(false)
  })

  it('detects whether to render node as title', () => {
    const props1 = {
      isRootNode: false,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const props2 = {
      isRootNode: true,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const node1 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 2,
    } as HierarchyNode<GpsFilterItemNode>

    const node2 = {
      data: {
        userSelection: 'all-nodes',
      } as GpsFilterItemNode,
      height: 2,
    } as HierarchyNode<GpsFilterItemNode>

    const node3 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 1,
    } as HierarchyNode<GpsFilterItemNode>

    const result1 = getShouldRenderNodeAs({ ...props1, node: node1 }).title()
    const result2 = getShouldRenderNodeAs({ ...props1, node: node2 }).title()
    const result3 = getShouldRenderNodeAs({ ...props1, node: node3 }).title()
    const result4 = getShouldRenderNodeAs({ ...props2, node: node1 }).title()

    expect(result1).toBe(true)
    expect(result2).toBe(false)
    expect(result3).toBe(false)
    expect(result4).toBe(false)
  })

  it('detects whether to render node as accordion and children', () => {
    const props1 = {
      isRootNode: false,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const props2 = {
      isRootNode: true,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const node1 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 1,
      children: ['a', 'b', 'c'],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const node2 = {
      data: {
        userSelection: 'all-nodes',
      } as GpsFilterItemNode,
      height: 1,
      children: ['a', 'b', 'c'],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const node3 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 2,
      children: ['a', 'b', 'c'],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const node4 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 2,
      children: [],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const result1 = getShouldRenderNodeAs({ ...props1, node: node1 }).accordionAndChildren()
    const result2 = getShouldRenderNodeAs({ ...props1, node: node2 }).accordionAndChildren()
    const result3 = getShouldRenderNodeAs({ ...props1, node: node3 }).accordionAndChildren()
    const result4 = getShouldRenderNodeAs({ ...props2, node: node1 }).accordionAndChildren()
    const result5 = getShouldRenderNodeAs({ ...props1, node: node4 }).accordionAndChildren()

    expect(result1).toBe(true)
    expect(result2).toBe(false)
    expect(result3).toBe(false)
    expect(result4).toBe(false)
    expect(result5).toBe(false)
  })

  it('detects whether to render node as children in container', () => {
    const props1 = {
      isRootNode: false,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const props2 = {
      isRootNode: true,
      dataCombination: 'and',
    } as GpsFilterNodeProps

    const node1 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 1,
      children: ['a', 'b', 'c'],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const node2 = {
      data: {
        userSelection: 'all-nodes',
      } as GpsFilterItemNode,
      height: 1,
      children: ['a', 'b', 'c'],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const node3 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 1,
      children: ['a', 'b', 'c'],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const node4 = {
      data: {
        userSelection: 'leaves-only',
      } as GpsFilterItemNode,
      height: 2,
      children: [],
    } as unknown as HierarchyNode<GpsFilterItemNode>

    const result1 = getShouldRenderNodeAs({ ...props1, node: node1 }).childrenInContainer()
    const result2 = getShouldRenderNodeAs({ ...props1, node: node2 }).childrenInContainer()
    const result3 = getShouldRenderNodeAs({ ...props1, node: node3 }).childrenInContainer()
    const result4 = getShouldRenderNodeAs({ ...props2, node: node1 }).childrenInContainer()
    const result5 = getShouldRenderNodeAs({ ...props1, node: node4 }).childrenInContainer()

    expect(result1).toBe(false)
    expect(result2).toBe(true)
    expect(result3).toBe(false)
    expect(result4).toBe(true)
    expect(result5).toBe(false)
  })
})
