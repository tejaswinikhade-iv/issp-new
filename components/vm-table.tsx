export interface VM {
  id: number
  name: string
  status: string
  public_ip_address: string
  private_ip_address: string
  series: string
  memory: string
  vcpus: string
}
<TableRow key={vm.id}>

  <TableCell>{vm.name}</TableCell>

  <TableCell>
    <TableBadge status={vm.status} />
  </TableCell>

  <TableCell>
    {vm.public_ip_address}
  </TableCell>

  <TableCell>
    {vm.private_ip_address}
  </TableCell>

  <TableCell>
    {vm.series}
  </TableCell>

  <TableCell>
    {vm.memory}
  </TableCell>

  <TableCell>
    {vm.vcpus}
  </TableCell>

  <TableCell>
    <ActionButtons
      provider="e2e"
      instanceId={vm.id}
      status={vm.status}
    />
  </TableCell>

</TableRow>