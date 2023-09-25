module.exports = arg => {
    const QRCodeGenerator = value => {
      return `
        <div style="display: flex; align-items: center;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${value}" alt="QR Code" />
        </div>
      `;
    };
    
    const {data,organization,startDate,endDate,count,sum, tax, total} = arg;
    //const items = arg.data.items;

    return `
    <style>
      h1,
      h2,
      h3,
      p {
          margin: 0;
      }
  
      .box-shadow {
          box-shadow: rgba(54, 53, 114, 0.1) 0px 5px 5px;
      }
  
      .border-radius {
          border-radius: 5px;
      }
  
      .container {
          width: 180px;
          margin: auto;
          border: 1px solid #00000030;
          padding: 20px;
          font-family: monospace;
          border-radius: 10px;
          padding-bottom: 10px;
      }
  
      .qrCode {
          // background-color: aquamarine;
          height: 100px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 30px 0 30px 0;
      }
  
      .heading {
          font-weight: 300;
          font-size: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
      }
  
      .title {
          font-size: 12px;
      }
  
      .reciept-head {
          display: flex;
          justify-content: space-between;
          margin-block: 10px;
      }
  
      .heading div:nth-child(2) {
          text-align: end;
      }
  
      .heading div>p:nth-child(2) {
          font-size: 10px;
          color: rgb(144 144 144);
      }
  
      .card-info {
          display: flex;
          align-items: space-between;
      }
  
      .card-info div {
          display: flex;
          align-items: center;
          gap: 10px;
      }
  
      .card-info h2 {
          margin-right: 20px;
          font-weight: 600;
          font-size: 20px;
      }
  
      .card-info h3 {
          font-weight: 300;
          font-size: 18px;
      }
  
      .items {
          border: 1px solid #00000015;
      }
  
      .padding {
          padding: 15px;
      }
  
      .items h2 {
          margin: 0 0 15px 0;
          font-size: 20px;
          font-weight: 700;
      }
  
      .items p {
          font-size: 10px;
      }
  
      .item {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #00000015;
      }
  
      .item-left p {
          margin: 0;
          margin-bottom: 5px;
      }
  
      .price {
          margin-top: 20px;
          border: 1px solid #00000015;
      }
  
      .price-div div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
      }
  
      .price-div p {
          font-size: 10px;
      }
  
      .total {
          font-size: 15px;
          font-weight: 700;
      }
  
      .payment-type {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
      }
  
      .payment-type p:nth-child(2) {
          font-size: 15px;
          font-weight: 700;
      }
      .center {
        display:flex;
        justify-content: center;
        margin: 12px 0 7px 0;
  
      }
  </style>
  
  <div class="container box-shadow">
      <div class="reciept-head">
          <h2 class="title">አጠቃላይ የሽያጭ መረጃ</h2>  
      </div>
      <h2 class="organization-name">${organization}</h2>
      <div class="heading">
          <div class="date">  
              <p>መነሻ ቀን</p>
              <p>${startDate}</p>
          </div>
          <div class="date">  
          <p>መጨረሻ ቀን</p>
          <p>${endDate}</p>
      </div>
         
      </div>
        
      
      <div class="price padding box-shadow border-radius">
          <div class="price-div">
          <div>
          <p>ብዛት </p>
          <p>${count}</p>
      </div>
              <div>
                  <p>ድምር</p>
                  <p>${sum} ብር</p>
              </div>
              <div>
                  <p>ታክስ </p>
                  <p>${tax} ብር</p>
              </div>
          </div>
          <hr />
          <div class="price-div">
              <div class="total">
                  <p>አጠቃላይ ድምር</p>
                  <p>${total} ብር</p>
              </div>
          </div>
      </div>

  </div>
  </div>
  `;
  };
  