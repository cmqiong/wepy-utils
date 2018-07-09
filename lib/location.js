const Location = {
  /**
   * 获取地理位置
   * @param options [object] 参数
   *
   * 使用示例：
   * getLocation({
        type                   : "wgs84", // [String], 默认 'wgs84', 返回 GPS 坐标
        success                : function (res) {}, // [Function], 获取地理位置成功后回调
        fail                   : function () {}, // [Function], 获取地里位置失败后回调
        complete               : function (res) {}, // [Function], 接口调用结束后回调
        cancel                 : null, // [Function], 当点击授权提示弹窗"取消"按钮后回调，可不写，默认使用 fail 参数的回调
        modalAuthorizationTitle: "提示", // [String], 授权提示弹窗标题
        modalAuthorizationTxt  : "允许获取地理位置信息", // [String], 授权提示弹窗文字内容
   * })
   */
  getLocation: function(options) {
      // 覆盖参数默认值
      options = Object.assign({
        type                   : "wgs84", // [String], 默认 'wgs84', 返回 GPS 坐标
        success                : function (res) {}, // [Function], 获取地理位置成功后回调
        fail                   : function () {}, // [Function], 获取地里位置失败后回调
        complete               : function (res) {}, // [Function], 接口调用结束后回调
        cancel                 : null, // [Function], 当点击授权提示弹窗"取消"按钮后回调，可不写，默认使用 fail 参数的回调
        modalAuthorizationTitle: "提示", // [String], 授权提示弹窗标题
        modalAuthorizationTxt  : "允许获取地理位置信息", // [String], 授权提示弹窗文字内容
      }, options);

      /**
       * wx.getLocation 逻辑：
       *  调用 "wx.getLocation" 后自动弹出系统提示："应用要获取地理位置，是否允许？"
       *    - 点击"确认"后，跳转系统设置页面进行授权设置
       *       - 进入系统设置后，未允许授权：再次弹出自定义窗口授权确认
       *       - 进入系统设置后，允许授权：成功回调
       *    - 点击"取消"后，再次弹出自定义弹窗进行授权确认
       *
       * 再次弹出自定义弹窗授权确认逻辑：
       *  调用 "wx.showModal" 弹窗确认
       *    - 点击"确认"后，调用 wx.openSetting 进入系统设置进行授权设置
       *       - 进入系统设置后，未允许授权：失败回调
       *       - 进入系统设置后，允许授权：成功回调
       *    - 点击"取消"后，取消回调或失败回调
       */

      this.doGetLocation(options, false);
    },

  /**
   * wx.getLocation 获取地理位置
   * @param options 参数配置
   * @param isAfterAuthorization 是否已通过授权同意，true 同意
   */
  doGetLocation: function(options, isAfterAuthorization) {
    const self = this
    wx.getLocation({
      type: options.type,
      success(res) {
        console.log("[getLocation]: 获取过地理位置 成功", res);

        options.success(res);
      },
      // 点击"取消"后，再次弹出自定义弹窗进行授权确认
      fail(res) {
        console.log("[getLocation]: 获取地理位置授权 失败", res);
      },
      complete(res) {
        if (!isAfterAuthorization) {
          if (!res.latitude || !res.longitude) {
            wx.showModal({
              title  : options.modalAuthorizationTitle,
              content: options.modalAuthorizationTxt,
              success: function (res) {
                if (res.confirm) {
                  self.doOpenAuthorizationModal(options);
                } else if (res.cancel) {
                  console.log("[getLocation]: 再次提示用户授权 取消，获取地理位置信息 失败");

                  options.cancel && options.cancel() || options.fail();
                }
              }
            });
          }
        }
        options.complete(res);
      }
    });
  },

  // 打开系统设置进行用户授权
  doOpenAuthorizationModal: function(options) {
    wx.openSetting({
      success: (res) => {
        // 进入系统设置后，允许授权
        if (res.authSetting["scope.userLocation"]) {
          console.log("[getLocation]: 再次授权获取地理位置信息 成功", res);

          doGetLocation(options, true);
        } else { // 进入系统设置后，未允许授权
          console.log("[getLocation]: 再次授权获取地理位置信息 失败", res);

          options.fail();
        }
      },
      fail   : (res) => {
        console.log("[getLocation]: 再次提示用户授权 失败，获取地理位置信息 失败", res);

        options.fail();
      }
    });
  },

  /**
   * 根据经纬度获取地理位置信息，默认坐标：北京市人民政府
   * @param  {Number} latitude   经度
   * @param  {Number} longitude  纬度
   * @return {Promise}       包含抓取任务的Promise
   */
  getLocateInfo: function(latitude = 39.90403, longitude = 116.407526) {
    const url = 'http://restapi.amap.com/v3/geocode/regeo'
    const params = {
      key: '8325164e247e15eea68b59e89200988b',
      location: `${longitude},${latitude}`,
      platform: 'JS',
      sdkversion: '1.3'
    }

    return new Promise(function(resolve, reject) {
      wx.request({
        url: url,
        data: params,
        success: function(res) {
          resolve(res)
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  }
}

module.exports = Location
