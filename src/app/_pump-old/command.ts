// enum CommandType {
//     Bolus,
// }

export class Command {
  type: String;
  dose?: number;
  duration?: number; // not necessarily the best arrangement here...
}
