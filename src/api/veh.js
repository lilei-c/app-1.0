import request from '@/utils/request'

const projectid = 55;
export const vehapi = {
  getveh: function (vehtype) {
    return new Promise((s, j) => {
      request({
        url: `getveh.do?projectid=${projectid}&vehtype=${vehtype}`,
        method: 'get'
      }).then(m => {
        console.log(m)
        if (m && (m.status == 200) && m.data)
          s(m.data)
        else
          j('error')
      })
        .catch(e => j(e))
    })
  },
  addveh: function (data) {
    if (!data.projectid)
      data.projectid = projectid
    return request({
      url: 'addveh.do',
      method: 'post',
      data: data,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}
