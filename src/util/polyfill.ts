if (!('fill' in Array.prototype)) {
  // IE doesn't support fill method for Array.
  /* tslint:disable:no-invalid-this */
  ;(Array.prototype as any).fill = function (value: number, start = 0, end: number): Array<any> {
    if (end === undefined) end = this.length
    for (let i = start; i < end; ++i) this[i] = value
    return this
  }
  /* tslint:enable:no-invalid-this */
}

if (!('fill' in Uint8Array.prototype)) {
  // Safari doesn't support fill method for typed array.
  /* tslint:disable:no-invalid-this */
  ;(Uint8Array.prototype as any).fill = function (
    value: number,
    start = 0,
    end: number,
  ): Uint8Array {
    if (end === undefined) end = this.length
    for (let i = start; i < end; ++i) this[i] = value
    return this
  }
  /* tslint:enable:no-invalid-this */
}
