import Subject from './Subject'

let _id = 0

export default class Observer {
  protected id = 0
  constructor(public name = '') {
    this.id = ++_id
  }

  update(sub: Subject<any>, ...args: any[]) {
    // ready for rewrite by sub class extends this
    console.log(
      `observer ${this.name} detect subject ${sub.name} change`,
      ...args,
    )
  }
}
