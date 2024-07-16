import type * as core from 'express-serve-static-core';
import type { Request, Response, NextFunction } from 'express';

type FunctionCallback<T extends FunctionCallback<T>> = (
  req: Request,
  res: Response<NormalizedResponse, GetResponseLocals<T>>,
  next: NextFunction
) => void;

type GetResponseBody<T extends FunctionCallback<T>> = Parameters<T>[0]['body'];

type GetResponseLocals<T extends FunctionCallback<T>> = Record<
  string,
  unknown
> &
  Parameters<T>[1]['locals'];

export type InferRequest<
  T extends FunctionCallback<T>,
  CustomReqBody extends Record<string, unknown> | void = void
> = Request<
  core.ParamsDictionary,
  unknown,
  CustomReqBody extends void
    ? GetResponseBody<T>
    : GetResponseBody<T> & CustomReqBody
>;

export type InferResponse<
  T extends FunctionCallback<T>,
  CustomLocals extends Record<string, unknown> | void = void,
  CustomResponse extends Record<string, unknown> | void = void
> = Response<
  CustomResponse extends void ? NormalizedResponse : CustomResponse,
  CustomLocals extends void
    ? GetResponseLocals<T>
    : GetResponseLocals<T> & CustomLocals
>;

type ResponseWithRequiredMessage<T> = {
  message: string;
  data?: T;
};

type ResponseWithRequiredData<T> = {
  data: T;
  message?: string;
};

type ResponseWithMessageOrData<T = unknown> =
  | ResponseWithRequiredMessage<T>
  | ResponseWithRequiredData<T>;

export type NormalizedResponse<
  T = unknown,
  U extends Record<string, unknown> | void = void
> = U extends void
  ? ResponseWithMessageOrData<T>
  : U & ResponseWithMessageOrData<T>;
