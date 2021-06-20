export interface Proxy {
  target: string;
  secure?: boolean;
  changeOrigin?: boolean;
  pathRewrite?: Record<string, string>;
}

export default interface ProxyTable extends Record<string, Proxy> {

}