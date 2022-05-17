class SyncHook {
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
    this.tasks.forEach((task) => {
      task(...args)
    })
  }
}

const syncHook = new SyncHook(['name'])

syncHook.tap('第一件事', (name: string) => {
  console.log('第一件事', name)
})

syncHook.tap('第二件事', (name: string) => {
  console.log('第二件事', name)
})

syncHook.call('jaylen')
