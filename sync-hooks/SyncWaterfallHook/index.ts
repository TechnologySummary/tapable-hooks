class SyncWaterfallHook {
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

    if (!this.tasks.length) return

    let initResult = this.tasks.shift()!(...args)

    args = args.slice(1)

    this.tasks.reduce((result, task) => {
      result = task(result, ...args)
      return result
    }, initResult)
  }
}

const syncWaterfallHook = new SyncWaterfallHook(['count', 'name'])

syncWaterfallHook.tap('第一次', (count: number, name: string) => {
  console.log('第一次', count, name)
  return count + 1
})

syncWaterfallHook.tap('第二次', (count: number, name: string) => {
  console.log('第二次', count, name)
  return count + 1
})

syncWaterfallHook.tap('第三次', (count: number, name: string) => {
  console.log('第三次', count, name)
})

syncWaterfallHook.call(1, 'jaylen')
