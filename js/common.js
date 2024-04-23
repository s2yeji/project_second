const API_KEY =
  'dRzoRJA7g4wPJN6t%2B1iCdSk9ZN%2BTwsKib6q%2BqOaA0B6wktWtjRmACTZnjZ4lqr3MUQmatHxTP1qg8SPTa4Nupw%3D%3D';
const searchBtn = document.querySelector('.btnSearch');
const searchInput = document.querySelector('.inputArea input');
const newMessage = document.querySelector('.cafeList');
let page = 1;
let pageSize = 4;
let totalResults = 0;
let groupSize = 5;
let currentPage = 1;

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

const moveToPage = async (pageNum) => {
  page = pageNum;
  currentPage = pageNum;
  const url = new URL(
    `https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${pageSize}`
  );
  await fetchCafe(url);
};

const pagination = () => {
  let pageGroup = Math.ceil(page / groupSize);
  console.log('#################### : ', pageGroup);
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  );
  let firstPage = (pageGroup - 1) * groupSize + 1;
  let totalPage = Math.ceil(totalResults / pageSize);

  let paginationHtml = `<button class="prev" ${
    page == 1 ? 'disabled' : ''
  } onclick="moveToPage(${
    currentPage - 1
  })"><i class="fa-solid fa-caret-left"></i></button>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += `<button class="${
      i == page ? 'on' : ''
    }" onclick="moveToPage(${i})">${i}</button>`;
  }

  paginationHtml += `<button class="next" ${
    page >= totalPage ? 'disabled' : ''
  } onclick="moveToPage(${
    currentPage + 1
  })"><i class="fa-solid fa-caret-right"></i></button>`;

  document.querySelector('.pg').innerHTML = paginationHtml;
};

const errorRender = (message) => {
  const errorHtml = `<li class="noList">ERROR ${message}</li>`;
  newMessage.innerHTML = errorHtml;
};

const fetchCafe = async (url) => {
  try {
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('page', page);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const data = await response.json();
    totalResults = data.response.body.totalCount;
    console.log(totalResults);

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    let cafeList = data.response.body.items.item;
    renderCafe(cafeList);
    pagination();
  } catch (error) {
    console.log('에러메시지 확인', error.message);
    errorRender(error.message);
  }
};

// 모든 데이터를 가져와서 검색어를 포함하는 데이터만 필터링
// totalCount = 85
const searchFn = async () => {
  let searchWord = searchInput.value;
  searchInput.value = '';
  const url = new URL(`
    https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=100" 
  `);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });
  const data = await response.json();
  let cafeList = data.response.body.items.item;
  cafeList = cafeList.filter((item) => item.CON_KEYWORDS.includes(searchWord)); // 검색어 필터링

  renderCafe(cafeList);
};

searchBtn.addEventListener('click', async () => {
  searchFn();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  searchFn();
});

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
          onerror="this.onerror=null; this.src='../img/noImg.png';"
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
