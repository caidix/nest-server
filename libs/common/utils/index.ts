import { User } from '@libs/db/entity/UserEntity';
import * as dayjs from 'dayjs';

/* 随机生成验证🐎 */
export const createVerificationCode = (len: number): string => {
  const library =
    '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';

  let code = '';
  for (let i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * 62);
    code += library[rand];
  }
  return code;
};

export const setEmailContent = (bgurl, sentence, code) => {
  const today = new Date().toLocaleDateString(); //获取今天的日期
  const weekday = new Date().toLocaleString('default', { weekday: 'long' }); // 获取今天是星期几
  const content = `
        <style>
        .container {
            background-color: rgb(165, 115, 140);
            background: url("${bgurl}") center no-repeat;
            background-size: 100%;
            width: 960px;
            height: 540px;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: center;
            color: white;
        }
        .title {
            font-size: 22px;
            margin-top: 50px;
        }
        .description {
            color: white;
        }
        .content {
            background: rgba(255, 255, 255, 0.5);
            margin: 0 auto;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
        }
        .content>p {
            text-align: left;
            font-size: 12px;
            color: white;
            width: 100%;
            margin: 5px auto;
            padding: 0;
        }
        </style>
        <div class="container">
            <div class="title">喜欢你很久了</div>
            <div class="content">
                <p style="display: flex;">
                    <span>😘今天是：${today}，${weekday}，这是我们爱的暗号：${code}~❤❤❤
                    </span>
                </p>
                <p></p>
                <p>${sentence}</p>
            </div>
        </div>
  `;
  return content;
};

type FormatTimeType = 'create' | 'update' | 'delete';
type FormatDataType = {
  updateTime: string;
  createTime?: string;
  creator?: number;
  operator?: number;
};
export const getFormatData = (type: FormatTimeType, user?: User) => {
  const baseTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const dataPicker = (data) => {
    return Object.keys(data)
      .filter((key) => Boolean(data[key]))
      .reduce((pre, key) => {
        data[key] && (pre[key] = data[key]);
        return pre;
      }, {}) as FormatDataType;
  };
  const userId = user?.id || undefined;
  switch (type) {
    case 'create':
      return dataPicker({
        createTime: baseTime,
        updateTime: baseTime,
        creator: userId,
        operator: userId,
      });
    case 'update':
      return dataPicker({
        updateTime: baseTime,
        operator: userId,
      });
    case 'delete':
      return dataPicker({
        updateTime: baseTime,
        deleteTime: baseTime,
        operator: userId,
        isDelete: 1,
      });
    default:
      return {};
  }
};

export function getIds(list: { id: number }[], childKey = 'children') {
  const ids = [];
  list.forEach((item) => {
    if (item.id) {
      ids.push(item.id);
    }
    if (item[childKey]) {
      ids.push(...getIds(item[childKey], childKey));
    }
  });
  return ids;
}
