const total = vms.length

const running =
  vms.filter(
    vm => vm.status === 'Running'
  ).length

const stopped =
  total - running