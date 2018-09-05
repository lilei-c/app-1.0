function geoInf(position, ccc) {
    var str = "";
    str += "地址：" + position.addresses + "\n";//获取地址信息
    str += "坐标类型：" + position.coordsType + "\n";
    var timeflag = position.timestamp;//获取到地理位置信息的时间戳；一个毫秒数；
    str += "时间戳：" + timeflag + "\n";
    var codns = position.coords;//获取地理坐标信息；
    var lat = codns.latitude;//获取到当前位置的纬度；
    str += "纬度：" + lat + "\n";
    var longt = codns.longitude;//获取到当前位置的经度
    str += "经度：" + longt + "\n";
    var alt = codns.altitude;//获取到当前位置的海拔信息；
    str += "海拔：" + alt + "\n";
    var accu = codns.accuracy;//地理坐标信息精确度信息；
    str += "精确度：" + accu + "\n";
    var altAcc = codns.altitudeAccuracy;//获取海拔信息的精确度；
    str += "海拔精确度：" + altAcc + "\n";
    var head = codns.heading;//获取设备的移动方向；
    str += "移动方向：" + head + "\n";
    var sped = codns.speed;//获取设备的移动速度；
    str += "移动速度：" + sped;
    //alert(str)
    console.log(str)
  }

  function getGeocode(ccc) {
    //alert(222222222222)
    plus.geolocation.getCurrentPosition(function (ppp) { geoInf(ppp, ccc) }, function (e) {
      alert("获取定位位置信息失败：" + e.message);
    }, { geocode: true });
  }

  function getGeocodeX() {
    return new Promise((s, j) => {
      plus.geolocation.getCurrentPosition(function (ppp) { s([ppp.coords.longitude, ppp.coords.latitude]) }, function (e) {
        alert("获取定位位置信息失败：" + e.message);
      }, { geocode: true });
    })
  }

  // 扩展API加载完毕后调用onPlusReady回调函数 
  document.addEventListener("plusready", onPlusReady, false);
  // 扩展API加载完毕，现在可以正常调用扩展API 
  function onPlusReady() {
    console.log("plusready");
  }
  // 拍照
  function captureImage() {
    return new Promise((s, j) => {
      var cmr = plus.camera.getCamera();
      var res = cmr.supportedImageResolutions[0];
      var fmt = cmr.supportedImageFormats[0];
      console.log("Resolution: " + res + ", Format: " + fmt);
      cmr.captureImage(function (path) {
        //alert("Capture image success: " + path);
        plus.io.resolveLocalFileSystemURL(path, function (entry) {
          entry.file(function (file) {
            var fileReader = new plus.io.FileReader();
            fileReader.onloadend = function (evt) {
              s(evt.target.result)
            }
            fileReader.readAsDataURL(file, 'utf-8');
          });
        }, function (e) {
          //alert("Resolve file URL failed: " + e.message);
          j(error)
        });
      },
        function (error) {
          // alert("Capture image failed: " + error.message);
          j(error)
        },
        { resolution: res, format: fmt }
      );
    })
  }

  // 从相册中选择图片 
  function galleryImg() {
    return new Promise((s, j) => {
      console.log("从相册中选择图片:");
      plus.gallery.pick(function (path) {
        console.log(path);
        plus.io.resolveLocalFileSystemURL(path, function (entry) {
          entry.file(function (file) {
            var fileReader = new plus.io.FileReader();
            fileReader.onloadend = function (evt) {
              s(evt.target.result)
            }
            fileReader.readAsDataURL(file, 'utf-8');
          });
        }, function (e) {
          //alert("Resolve file URL failed: " + e.message);
          j(error)
        });
      }, function (e) {
        console.log("取消选择图片");
      }, { filter: "image" });
    })
  }