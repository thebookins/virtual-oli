export class Status {
  glucose: {
    gut: {
      meals: { g: number, t: number }[]
    },
    accessible: {
      Q: number
    }
  };
  insulin: {
    compartments: { S: number }[],
    action: {
      x: number[]
    }
  }
}
