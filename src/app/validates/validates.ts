import { ValidatorFn, AbstractControl } from '@angular/forms';

function rex(type: string, validateRex: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const str = control.value;
    const res = {};
    res[type] = { str };
    return validateRex.test(str) ? null : res;
  };
}

export class ValidateRex {
  static only = rex('only', /^[0-9a-zA-Z_]+$/);
  static rex = rex;
}

export function Authbts(level1, level2) {
  const sysmenus = window.localStorage.getItem('menus');
  const showusertype = JSON.parse(sysmenus);
  const btns: any = [];


  if (showusertype && showusertype.length > 0) {
    for (let i = 0; i < showusertype.length; i++) {
      if (showusertype[i].menuname === level1 && showusertype[i].List && showusertype[i].List.length > 0) {
        for (let j = 0; j < showusertype[i].List.length; j++) {
          if (showusertype[i].List[j].menuname === level2) {
            for (let b = 0; b < showusertype[i].List[j].powerbtn.length; b++) {
              if (showusertype[i].List[j].powerbtn[b].groupings && showusertype[i].List[j].powerbtn[b].groupings.length > 0) {
                for (let k = 0; k < showusertype[i].List[j].powerbtn[b].groupings.length; k++) {
                  btns.push(showusertype[i].List[j].powerbtn[b].groupings[k].btnname);
                }
              }

            }
            break;
          }
        }
      }
    }
  }
  return btns;
}
// 判断按钮是否显示
export function Whetherdisplay(arr, obj) {
  let i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

// 日期控件值转换成字符串
export function GMTToStr(time) {
  let month: any = time.getMonth() + 1;
  let day: any = time.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  const Str = time.getFullYear() + '-' + month + '-' + day;
  return Str;
}

// export function ValidateRex(type: string, validateRex: RegExp): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } => {
//     const str = control.value;
//     const res = {};
//     res[type] = { str };
//     return validateRex.test(str) ? null : res;
//   };
// }


