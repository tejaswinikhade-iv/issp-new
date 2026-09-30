export interface E2ETag {
  key?: string
  name?: string
  value?: string
}

export interface E2ENode {
  id: string
  name?: string
  status?: string
  location?: string
  public_ip_address?: string
  private_ip_address?: string
  plan?: string
  created_at?: string
  tags?: E2ETag[]
  [key: string]: unknown
}

export function getNodeName(node: E2ENode) {
  return node.name || node.id || 'Unnamed node'
}

export function getStatus(node: E2ENode) {
  return String(node.status || 'Unknown')
}

export function isRunning(node: E2ENode) {
  return ['running', 'active', 'up', 'online'].includes(getStatus(node).toLowerCase())
}

export function isStopped(node: E2ENode) {
  return ['stopped', 'powered off', 'terminated', 'down', 'offline'].includes(
    getStatus(node).toLowerCase(),
  )
}

export function readTag(node: E2ENode, key: string): unknown {
  const tag = (node.tags || []).find((item) => (item.key || item.name) === key)
  if (!tag?.value) return undefined

  try {
    return JSON.parse(tag.value)
  } catch {
    return tag.value
  }
}

export function getOwner(node: E2ENode) {
  const ownership = readTag(node, 'iv:self-service:ownership')
  if (ownership && typeof ownership === 'object' && 'owner' in ownership) {
    return String((ownership as { owner?: unknown }).owner || '')
  }
  return typeof ownership === 'string' ? ownership : ''
}
