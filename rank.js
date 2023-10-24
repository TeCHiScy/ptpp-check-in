const checkInConfigs = {
  'hdfun.me': 'https://hdfun.me/attendance.php',
  'htpt.cc': 'https://www.htpt.cc/attendance.php',
  'lemonhd.org': 'https://lemonhd.org/attendance.php',
  'nicept.net': 'https://www.nicept.net/attendance.php',
  'ourbits.club': 'https://ourbits.club/attendance.php',
  'pterclub.com': 'https://pterclub.com/attendance-ajax.php',
  'pthome.net': 'https://pthome.net/attendance.php',
  'pttime.org': 'https://www.pttime.org/attendance.php',
  'hdmayi.com': 'https://hdmayi.com/attendance.php',
  'pt.btschool.club': 'https://pt.btschool.club/index.php?action=addbonus',
  'discfan.net': 'https://discfan.net/attendance.php',
  'haidan.video': 'https://www.haidan.video/signin.php',
  'hddolby.com': 'https://www.hddolby.com/attendance.php',
  'pt.soulvoice.club': 'https://pt.soulvoice.club/attendance.php',
  '1ptba.com': 'https://1ptba.com/attendance.php',
  'hdatmos.club': 'https://hdatmos.club/attendance.php',
  'hdcity.city': 'https://hdcity.city/sign',
  'hdhome.org': 'https://hdhome.org/attendance.php',
  '52pt.site': (item) => {
    $.get('https://52pt.site/bakatest.php', (data) => {
      if (data.indexOf('name="questionid" value="') !== -1) {
        let questionId = data.split('name="questionid" value="');
        if (questionId[1] !== undefined) {
          questionId = questionId[1].split('"')[0];
          if (!isNaN(questionId)) {
            $.post('https://52pt.site/bakatest.php', { wantskip: '不会', choice: [1], questionid: questionId }, () => {
              localStorage.setItem('check_in.52pt.site', getDate());
              item.find('.caption').after('<span style="color:green;">✔</span>');
            });
          }
        }
      }
    })
  },
  'chdbits.co': (item) => {
    $.get('https://chdbits.co/bakatest.php', (data) => {
      if (data.indexOf('name="questionid" value="') !== -1) {
        let questionId = data.split('name="questionid" value="');
        if (questionId[1] !== undefined) {
          questionId = questionId[1].split('"')[0];
          if (!isNaN(questionId)) {
            $.post('https://chdbits.co/bakatest.php', { wantskip: '不会', choice: [1], questionid: questionId }, () => {
              localStorage.setItem('check_in.chdbits.co', getDate());
              item.find('.caption').after('<span style="color:green;">✔</span>');
            })
          }
        }
      }
    })
  },
  'hdarea.co': (item) => {
    $.post('https://www.hdarea.co/sign_in.php', { action: 'sign_in' }, () => {
      localStorage.setItem('check_in.hdarea.co', getDate());
      item.find('.caption').after('<span style="color:green;">✔</span>');
    });
  },
  'hdchina.org': (item) => {
    $.get('https://hdchina.org/', (data) => {
      if (data.indexOf('<meta name="x-csrf" content="') !== -1) {
        const csrf = data.split('<meta name="x-csrf" content="');
        if (csrf[1] !== undefined) {
          csrf = csrf[1].split('"')[0];
          if (csrf.length > 0) {
            $.post('https://hdchina.org/plugin_sign-in.php?cmd=signin', { csrf: csrf }, () => {
              localStorage.setItem('check_in.hdchina.org', getDate());
              item.find('.caption').after('<span style="color:green;">✔</span>');
            })
          }
        }
      }
    })
  },
  'pt.hdupt.com': (item) => {
    $.post('https://pt.hdupt.com/added.php', { action: 'qiandao' }, () => {
      localStorage.setItem('check_in.pt.hdupt.com', getDate());
      item.find('.caption').after('<span style="color:green;">✔</span>');
    });
  },
  'totheglory.im': (item) => {
    $.get('https://totheglory.im', (data) => {
      if (data.indexOf('$.post("signed.php", {') !== -1) {
        let param = data.split('$.post("signed.php", {');
        if (param[1] !== undefined) {
          if (data.indexOf('},') !== -1) {
            param = param[1].split('},');
            if (param[0] !== undefined) {
              param = param[0].replace(/:/g, '=').replace('/,/g', ';');
              eval(param);
              if (signed_timestamp !== undefined && signed_token !== undefined) {
                $.post("https://totheglory.im/signed.php", {
                  signed_timestamp: signed_timestamp,
                  signed_token: signed_token
                }, () => {
                  localStorage.setItem('check_in.totheglory.im', getDate());
                  item.find('.caption').after('<span style="color:green;">✔</span>');
                });
              }
            }
          }
        }
      }
    })
  }
};

Array.prototype.remove = function (val) {
  const index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

let timer = setInterval(() => {
  if ($('tr .center').length > 0) {
    getCheckInStatus();
    $('a[href="#/statistic"]').after('<button title="登录态续期" id="extend_cookie_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">stars</i></div></button>')
    $('#extend_cookie_button').on('click', extendCookie);

    $('#extend_cookie_button').after('<button title="一键签到" id="check_in_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">book</i></div></button>')
    $('#check_in_button').on('click', checkIn);

    $('#check_in_button').after('<button title="流量条" id="mybar_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">dehaze</i></div></button>')
    $('#mybar_button').on('click', showMybar);

    window.clearInterval(timer);
  }
}, 100);

setInterval(() => {
  if (window.location.hash !== '#/home' && window.location.hash !== '#/' && $('.fc-button-group').length > 0) {
    location.reload();
  }
  // 检查是否有未登录
  $('a:contains("未登录")').each(function () {
    if ($(this).next().length > 0) {
      return;
    }
    $(this).after('<br><a>导入过期 Cookie</a>');
    $(this).next().next().on('click', function () {
      importExpiredCookie($(this).parents('tr').children().find('a').eq(0).attr('href'));
    })
  })
}, 1000);

function genMybarPic() {
  $('#mybar_bbcode').hide();
  $('#mybar_pic').hide();
  $('#mybar_loading').show();
  html2canvas($('.v-content__wrap')[0], { useCORS: true, width: 444, background: "#fff" }).then((canvas) => {
    $($('.v-content__wrap')[0]).find('img').remove();
    $($('.v-content__wrap')[0]).find('br').remove();
    $($('.v-content__wrap')[0]).append(canvas);
    $('#mybar_loading').hide();
  });
}

function showMybar() {
  let tbody = $('tbody');
  chrome.storage.local.get('PT-Plugin-Plus-Config', (r) => {
    if (r['PT-Plugin-Plus-Config']['sites'] !== undefined) {
      let sites = r['PT-Plugin-Plus-Config']['sites'];

      $($('.v-content__wrap')[0]).html('<button style="margin-left: 572px;position: absolute;" id="mybar_close" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">关闭&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">cancel</i></div></button>');
      $($('.v-content__wrap')[0]).append('<button style="display:none;margin-left: 572px;margin-top:50px;position: absolute;" id="mybar_bbcode" title="用于论坛等" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">生成 BBCode 代码&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">code</i></div></button>');
      $($('.v-content__wrap')[0]).append('<button style="display:none;margin-left: 572px;margin-top:100px;position: absolute;" id="mybar_pic" title="生成图片" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">生成图片&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">panorama</i></div></button>');
      $($('.v-content__wrap')[0]).append('<button style="margin-left: 672px;position: absolute;" id="mybar_loading" title="正在生成" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">正在生成<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div></button>');

      let mybarLoadingTimer = setInterval(() => {
        if ($('#mybar_loading').length === 0) {
          window.clearInterval(mybarLoadingTimer);
          return;
        }
        if ($('#mybar_loading').html().length % 2 === 1) {
          $('#mybar_loading').html('<div class="v-btn__content">正在加载。。<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div>');
        } else {
          $('#mybar_loading').html('<div class="v-btn__content">正在加载。<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div>');
        }
      }, 300)

      let bbcode = '';
      $('#mybar_close').on('click', () => { location.reload(); });
      $('#mybar_bbcode').on('click', () => {
        $('#mybar_bbcode').remove();
        $($('.v-content__wrap')[0]).find('img').remove()
        $($('.v-content__wrap')[0]).find('br').remove()
        $('#mybar_pic').remove();
        $($('.v-content__wrap')[0]).append('<textarea style="width: 500px;height: 100%;">' + bbcode + '</textarea>');
      });
      $('#mybar_pic').on('click', genMybarPic);

      tbody.children().each(function () {
        const item = $(this);
        if (!item.children().eq(1).text()) {
          return;
        }
        let siteurl = item.find('.caption').parent()?.attr('href');
        if (!siteurl) {
          return;
        }

        let host = new URL(siteurl).host;
        if (!host) {
          return;
        }

        let user = '';
        for (const site of sites) {
          if (host === site['host'] || host.replace(/www./, '') === site['host']) {
            let schema = '';
            if (site['schema'] !== undefined) {
              schema = site['schema'];
            } else {
              $.ajax({
                url: '/resource/sites/' + site['host'] + '/config.json',
                async: false,
                type: 'GET',
                dataType: 'JSON',
                success: (data) => { schema = data.schema; },
              })
            }
            if (schema === 'NexusPHP' || schema === 'TTG' || host === 'ccfbits.org') {
              user = site['user'];
            }
            break;
          }
        }

        if (user === '' || isNaN(user.id) || !user.id) {
          return;
        }
        if (host === 'hdcity.city') {
          user.id = user.id[0];
        }

        if (!siteurl.endsWith('/')) {
          siteurl += '/';
        }
        const barurl = siteurl + 'mybar.php?userid=' + user.id + '.png';
        $.ajax({
          url: barurl,
          type: 'GET',
          timeout: 10000,
          success: (data) => {
            if (data.length < 800) {
              return;
            }
            bbcode += '[img]' + barurl + '[/img]' + "\r\n";
            $($('.v-content__wrap')[0]).append('<img style="margin-top:5px;width:444px;" src="' + barurl + '"><br>');
          },
        })
      });
      $(document).ajaxStop(() => {
        $('#mybar_loading').hide()
        $("#mybar_bbcode").show();
        $("#mybar_pic").show();
      });
    }
  });
}

function importExpiredCookie(site_url) {
  try {
    chrome.cookies.getAllCookieStores(() => { });
  } catch (e) {
    alert('请前往权限设置打开 Cookies 操作权限');
    return;
  }
  var cookies = prompt("导入cookie", "请复制ptpp备份文件中的cookies.json，内容全部粘贴到这里");
  try {
    cookies = JSON.parse(cookies);
    if (cookies.length > 0) {
      let import_cookies_flag = false;
      for (var i = 0; i < cookies.length; i++) {
        if (site_url === cookies[i].url) {
          for (var j = 0; j < cookies[i].cookies.length; j++) {
            chrome.cookies.set({
              url: site_url,
              name: cookies[i].cookies[j].name,
              value: cookies[i].cookies[j].value,
              domain: cookies[i].cookies[j].domain,
              path: cookies[i].cookies[j].path,
              secure: cookies[i].cookies[j].secure,
              httpOnly: cookies[i].cookies[j].httpOnly,
              sameSite: cookies[i].cookies[j].sameSite,
              storeId: cookies[i].cookies[j].storeId,
              expirationDate: 2147483647,
            }, (cookie) => { });
            import_cookies_flag = true;
          }
          break;
        }
      }
      if (import_cookies_flag === false) {
        alert('恢复失败');
      } else {
        alert('恢复成功,请尝试重新刷新站点');
      }
    } else {
      alert('格式不正确，请复制ptpp备份文件中的cookies.json，内容全部复制到这里');
    }
  } catch (e) {
    alert('格式不正确，请复制ptpp备份文件中的cookies.json，内容全部粘贴到这里');
  }
}

function getDate() {
  return (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0');
}

function getCheckInStatus() {
  $('tbody').children().each(function () {
    const item = $(this);
    if (!item.children().eq(1).text()) {
      return;
    }
    let url = item.find('.caption').parent()?.attr('href');
    if (!url) {
      return;
    }
    url = new URL(url).host.replace(/www\./, '');
    if (localStorage.getItem('check_in.' + url) === getDate()) {
      item.find('.caption').after('<span id="check_in" style="color:green;">✔</span>');
    }
  });
}

function checkIn() {
  $('tbody').children().each(function () {
    const item = $(this);
    if (!item.children().eq(1).text()) {
      return;
    }
    let siteurl = item.find('.caption').parent()?.attr('href');
    if (!siteurl) {
      return;
    }
    item.find('.caption').siblings('span#check_in').remove();
    item.find('.caption').after('<span id="check_in">❓</span>');

    let host = new URL(siteurl).host.replace(/www\./, '');
    const cfg = checkInConfigs[host];
    if (typeof cfg === 'function') {
      cfg(item);
    } else if (typeof cfg === 'string') {
      $.ajax({ url: cfg, method: "GET", timeout: 5000 })
        .done(() => {
          localStorage.setItem('check_in.' + host, getDate());
          item.find('.caption').siblings('span#check_in').remove();
          item.find('.caption').after('<span id="check_in" style="color:green;">✔</span>');
        })
        .fail(() => {
          item.find('.caption').siblings('span#check_in').remove();
          item.find('.caption').after('<span id="check_in">❌</span>');
        });
    }
  });
}

function extendCookie() {
  if (localStorage.getItem('cookie_backup') !== null) {
    if (!confirm('您已使用过此功能，确定再次续期登录态么？')) {
      return;
    }
  } else {
    if (!confirm('确定续期登录态么？')) {
      return;
    }
  }

  try {
    chrome.cookies.getAllCookieStores(() => { });
  } catch (e) {
    alert('请前往权限设置，打开cookie操作权限');
    return;
  }

  const list = $('tbody').children();
  var cookie_backup = [];
  for (let i = 0; i < list.length; i++) {
    var item = $(list[i]);
    if (!item.children().eq(1).text()) {
      continue;
    }
    let siteurl = item.find('.caption').parent()?.attr('href');
    if (!siteurl) {
      continue;
    }
    chrome.cookies.getAll({ "url": siteurl }, (cookie) => {
      let update_cookie_count = 0;
      for (let j = 0; j < cookie.length; j++) {
        cookie_backup.push(cookie[j]);
        if (typeof cookie[j].expirationDate === 'undefined') {
          continue;
        }
        if (typeof cookie[j].name === 'undefined') {
          continue;
        }
        chrome.cookies.set({
          url: siteurl,
          name: cookie[j].name,
          value: cookie[j].value,
          domain: cookie[j].domain,
          path: cookie[j].path,
          secure: cookie[j].secure,
          httpOnly: cookie[j].httpOnly,
          expirationDate: 2147483647,
        }, (cookie) => { });
        update_cookie_count++;
      }
    });
  }
  setTimeout(() => {
    if (localStorage.getItem('cookie_backup') === null) {
      localStorage.setItem('cookie_backup', JSON.stringify(cookie_backup));
    }
    alert('更新成功');
  }, 2000);
}
