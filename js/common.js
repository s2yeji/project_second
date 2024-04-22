const API_KEY =
  'dRzoRJA7g4wPJN6t%2B1iCdSk9ZN%2BTwsKib6q%2BqOaA0B6wktWtjRmACTZnjZ4lqr3MUQmatHxTP1qg8SPTa4Nupw%3D%3D';
const searchBtn = document.querySelector('.btnSearch');
const searchInput = document.querySelector('.inputArea input');
const newMessage = document.querySelector('.cafeList');
let page = 1;
let pageSize = 8;
let totalResults = 0;
let groupSize = 5;

/*
  const ham = document.createElement('div');
  ham.classList.add('ham');
  ham.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  hdInner.appendChild(ham);
*/

const fetchCafe = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });
  const data = await response.json();
  let cafeList = data.response.body.items.item;
  renderCafe(cafeList);
};

const searchFn = () => {
  const searchWord = searchInput.value;
  searchInput.value = '';
  const url = new URL(`
    https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${pageSize}&CON_KEYWORDS=${searchWord}
  `);
  fetchCafe(url);
};

searchBtn.addEventListener('click', async () => {
  searchFn();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  searchFn();
});

//
// searchBtn.addEventListener('click', async () => {
//   const searchInput = document.querySelector('.inputArea input');
//   const searchWord = searchInput.value;
//   console.log(searchWord);

//   const url = new URL(`
//     https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${pageSize}&CON_KEYWORDS=${searchWord}
//   `);

//   fetchCafe(url);
// });

// 3
const createHtml = (cafe) => {
  console.log(cafe);
  let imgfilename = cafe.CON_IMGFILENAME || '../img/noImg.png';
  let title = cafe.CON_TITLE;
  let simpleDesc = cafe.SRC_TITLE;
  let desc = cafe.CON_CONTENT;
  let address = cafe.CON_ADDRESS;
  let homepage = cafe.CON_HOMEPAGE;
  let phone = cafe.CON_PHONE;

  return `
    <li class="cafe">
      <div class="img">
        <img
          src="https://www.gyeongju.go.kr/upload/content/${imgfilename}"
          alt="${title}"
          onerror="this.onerror=null; this.src='../img/noImg.png'"
        />
      </div>
      <div class="info">
        <h3>${title}</h3>
        <div class="deInfo">
          <div class="simpleDesc">${simpleDesc}</div>
          <div class="desc">${desc}</div>
          <div class="address"><i class="fa-solid fa-location-dot"></i> ${address}</div>
          <div class="other">
            <a
              href="${homepage}"
              target="_blank"
              ><i class="fa-solid fa-house"></i
            ></a>
            <a href="tel:${phone}"
              ><i class="fa-solid fa-mobile-screen-button"></i
            ></a>
          </div>
        </div>
      </div>
    </li>
  `;
};

// 2
const renderCafe = (cafeList) => {
  if (cafeList.length == 0) {
    newMessage.innerHTML = `<li class="noList">검색 결과가 없습니다.</li>`;
    return;
  }
  const cafeHtml = cafeList.map((cafe) => createHtml(cafe)).join('');
  document.querySelector('.cafeList').innerHTML = cafeHtml;
};

// 1
const getLatestDatas = async () => {
  const url = new URL(
    `https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${pageSize}`
  );
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  /*
    const img = dataList.map((item) => item.CON_IMGFILENAME);
    const title = dataList.map((item) => item.CON_TITLE);
    const srcTitle = dataList.map((item) => item.SRC_TITLE);
    const content = dataList.map((item) => item.CON_CONTENT);
    const summary = dataList.map((item) => item.CON_SUMMARY);
    const keywords = dataList.map((item) => item.CON_KEYWORDS);
    const address = dataList.map((item) => item.CON_ADDRESS);
    const phone = dataList.map((item) => item.CON_PHONE);
    const homepage = dataList.map((item) => item.CON_HOMEPAGE);
    console.log(img);
    console.log(title);
    console.log(srcTitle);
    console.log(content);
    console.log(summary);
    console.log(keywords);
    console.log(address);
    console.log(phone);
    console.log(homepage);
  */

  fetchCafe(url);
};

getLatestDatas();
