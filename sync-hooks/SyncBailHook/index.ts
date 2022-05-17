class SyncBailHook {
  private tasks: Array<Function>
  private params: Array<string>

  constructor(params: Array<string>) {
    this.params = params
    this.tasks = []
  }

  tap(_taskName: string, task: Function) {
    this.tasks.push(task)
  }

  call(...args: Array<any>) {
    args = args.slice(0, this.params.length)

    for (let i = 0; i < this.tasks.length; i++) {
      const result = this.tasks[i]!(...args)
      if (result) break
    }
  }
}

const syncBailHook = new SyncBailHook(['name'])

syncBailHook.tap('第一件事', (name: string) => {
  console.log('第一件事', name)
})
syncBailHook.tap('第二件事', (name: string) => {
  console.log('第二件事', name)
  return name
})
syncBailHook.tap('第三件事', (name: string) => {
  console.log('第三件事', name)
})

syncBailHook.call('jaylen')
