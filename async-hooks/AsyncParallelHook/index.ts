class AsyncParallelHook {
  private tasks: Array<(...args: any) => Promise<any>>
  private params: Array<string>

  constructor(params: Array<string>) {
    this.params = params
    this.tasks = []
  }

  tap(_taskName: string, task: (...args: any) => Promise<any>) {
    this.tasks.push(task)
  }

  call(...args: Array<any>) {
    const finalCb = args.pop()

    args = args.slice(0, this.params.length)

    const pendingTasks = this.tasks.map((task) => task(...args))

    return Promise.all(pendingTasks)
      .then(finalCb)
      .catch((err) => console.log(err))
  }
}

const asyncParallelHook = new AsyncParallelHook(['name'])

asyncParallelHook.tap(
  '第一件事',
  (name: string) =>
    new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve('第一件事' + 'chan' + name)
      }, 1000)
    })
)

asyncParallelHook.tap(
  '第二件事',
  (name: string) =>
    new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve('第二件事' + 'chan' + name)
      }, 1000)
    })
)

asyncParallelHook.call('jaylen', (res: any) => {
  console.log(res)
})
