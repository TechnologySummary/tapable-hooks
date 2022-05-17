class AsyncSeriesHook {
  private tasks: Array<(...args: Array<any>) => Promise<any>>
  private params: Array<string>

  constructor(params: Array<string>) {
    this.params = params
    this.tasks = []
  }

  tap(_taskName: string, task: (...args: Array<any>) => Promise<any>) {
    this.tasks.push(task)
  }

  call(...args: Array<any>) {
    const finalCb = args.pop()

    args = args.slice(0, this.params.length)

    if (!this.tasks.length) return

    const firstTask = this.tasks.shift()!(...args)

    const finalTask = this.tasks.reduce((preTask, curTask) => {
      preTask = preTask.then(() => curTask(...args))
      return preTask
    }, firstTask)

    finalTask.then(finalCb)
  }
}

const asyncSeriesHook = new AsyncSeriesHook(['name'])
asyncSeriesHook.tap(
  '第一件事',
  (name: string) =>
    new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(console.log('第一件事' + name))
      }, 1000)
    })
)
asyncSeriesHook.tap(
  '第二件事',
  (name: string) =>
    new Promise((resolve, _reject) => {
      setTimeout(() => resolve(console.log('第一件事' + name)), 1000)
    })
)

asyncSeriesHook.call('jaylen', () => {
  console.log('finish all things')
})
