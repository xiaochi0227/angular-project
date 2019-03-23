import { HttpResponse } from './api.model';

/**
 * 登录请求参数对象
 */
class LoginParameterModel {
  // 用户名
  code: string;
  // 密码
  pwd: string;
  // 系统编码
  system: string;
  // 门店
  store: string;
}

// 登录请求参数对象
export type LoginParameter = Partial<LoginParameterModel>;


/**
 * 登录返回结果
 */
export class LoginResponse extends HttpResponse {
  data?: { token: string };
}

// 用户信息
class UserInfoAll {
  code: string;
  name: string;
  usertype: string;
  userstores: string[];
  is_binding: boolean;
  rolecode: string[];
  ent_id: string;
  status: string;
  mobileNo: string;
  channel_keywords: string[];
  iss: string;
  exp: number;
  sub: string;
  aud: string;
}

export type Userinfo = Partial<UserInfoAll>;

export class ValidateResponse extends HttpResponse {
  data?: Userinfo;
}

/**
 * 本地缓存鉴权信息
 */
export class LocalAuth {
  token: string;
  exp: number;
}
