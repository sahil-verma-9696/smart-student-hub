import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidSemesterForCourse(options?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidSemesterForCourse',
      target: target.constructor,
      propertyName,
      options,
      validator: {
        validate(semesterValue: any, args: ValidationArguments) {
          const obj: any = args.object;
          const course = obj.course?.toLowerCase();
          const year = Number(obj.year);
          const semester = Number(semesterValue);

          // Course-based semester rules
          const rules = {
            btech: {
              1: [1, 2],
              2: [3, 4],
              3: [5, 6],
              4: [7, 8],
            },
            mtech: {
              1: [1, 2],
              2: [3, 4],
            },
            diploma: {
              1: [1, 2],
              2: [3, 4],
              3: [5, 6],
            },
            bca: {
              1: [1, 2],
              2: [3, 4],
              3: [5, 6],
            },
            bba: {
              1: [1, 2],
              2: [3, 4],
              3: [5, 6],
            },
            phd: {
              1: [1, 2],
              2: [3, 4],
              3: [5, 6],
              4: [7, 8],
              5: [9, 10],
            },
          };

          // If course invalid
          if (!rules[course]) return false;

          // If year invalid for course
          if (!rules[course][year]) return false;

          // Validate semester
          return rules[course][year].includes(semester);
        },

        defaultMessage(args: ValidationArguments) {
          const obj: any = args.object;
          return `Invalid semester '${args.value}' for course '${obj.course}' in year '${obj.year}'`;
        },
      },
    });
  };
}
