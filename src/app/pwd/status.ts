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
    I: number,
    compartments: { S: number }[],
    action: {
      x: number[]
    }
  }
}
