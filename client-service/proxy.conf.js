/*
 * Copyright © 2016-2021 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const forwardUrl = "http://localhost:9090/";
const outh2Url = "http://localhost:9090/";
const wsForwardUrl = "ws://localhost:9090/";
// const outh2Url = "http://192.168.68.90:8080/";

// const forwardUrl = "http://scadabroker.canhbaoews.com.vn/";
// const wsForwardUrl = "ws://scadabroker.canhbaoews.com.vn/";
// const forwardUrl = "http://localhost:8080/";
// const wsForwardUrl = "ws://localhost:8080/";
const customizeUrl = "http://localhost:9090/";
// const customizeUrl = "http://192.168.68.21:4200/";
const vpnUrl = "http://http://192.168.68.94:8080/"
const ruleNodeUiforwardUrl = forwardUrl;

const PROXY_CONFIG = {
  "/api": {
    "target": forwardUrl,
    "secure": false,
  },
  "/static/rulenode": {
    "target": ruleNodeUiforwardUrl,
    "secure": false,
  },
  "/static/widgets": {
    "target": forwardUrl,
    "secure": false,
  },
  "/oauth2": {
    "target": outh2Url,
    "secure": false,
  },
  "/login/oauth2": {
    "target": outh2Url,
    "secure": false,
  },
  "/api/ws": {
    "target": wsForwardUrl,
    "ws": true,
    "secure": false
  },
  "/attributes": {
    "target": customizeUrl,
    "secure": false
  }
};

module.exports = PROXY_CONFIG;
