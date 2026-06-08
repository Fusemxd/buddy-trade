# Trade Buddy War Room

## English

### Description

Trade Buddy War Room is a chat-first, rule-based trading assistant for beginner traders with small capital. It helps users check market status, calculate risk, review trading setups, keep a trade journal, and ask Buddy questions with optional chart screenshots.

### Important Safety Disclaimer

Trade Buddy War Room is an educational risk-management assistant. It does not provide guaranteed financial advice, does not auto-trade, and does not connect to real exchange accounts.

### Features

- Chat-first War Room interface
- Agent status bar
- Market Dashboard
- Custom Binance crypto watchlist
- BTCUSDT / ETHUSDT / SOLUSDT and other Binance USDT public market data
- Mini price charts from public candles
- EMA20 / EMA50 / RSI14
- Rule-based market status
- Risk Calculator
- Setup Checklist
- Trade Journal
- Daily Stop warning
- Losing streak warning
- Screenshot upload in chat
- Rule-based assistant replies
- Multi-Agent Discussion + Exit Plan Alert
- Mobile bottom navigation
- Future AI API-ready architecture

### Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- technicalindicators
- Binance Public REST API
- localStorage
- Vercel-ready deployment

### Market Data

- The app uses Binance Public API for crypto market data.
- No Binance API key is required.
- No exchange account connection is used.
- Only public market data is fetched.
- Custom watchlist supports Binance crypto USDT symbols such as BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT, DOGEUSDT, ADAUSDT, LINKUSDT, AVAXUSDT, and SUIUSDT.
- Data is used for planning and risk review only. It is not a trading command.

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy on Vercel

1. Push the project to GitHub
2. Import the repository into Vercel
3. Framework: Next.js
4. Build command: `npm run build`
5. Deploy

### Future AI API Notes

- Current version works without OpenAI API.
- Future AI Vision can be added later for chart screenshot analysis.
- API keys must not be exposed on the client.
- Future AI calls should happen in server routes only, such as `src/app/api/chat/route.ts`.
- Add AI API environment variables later only when the server route is implemented.

### Future Roadmap

- AI Vision for chart screenshot analysis
- AI chat API integration
- Market context injection into chat
- Risk context injection into chat
- Journal context injection into chat
- Better backtesting tools
- Improved agent animations

### Current Limitations

- Crypto USDT pairs only for now.
- Binance Public API availability and rate limits may affect refreshes.
- Market data can be delayed or temporarily unavailable.
- Mini charts are lightweight visual aids, not full technical charting tools.

## ภาษาไทย

### คำอธิบาย

Trade Buddy War Room คือผู้ช่วยเทรดแบบ chat-first และ rule-based สำหรับมือใหม่ที่มีทุนน้อย โดยออกแบบให้เหมาะกับผู้ใช้ทุนประมาณ 500 บาท ช่วยเช็กภาพรวมตลาด คำนวณความเสี่ยง ตรวจแผนเทรด บันทึก Journal และถาม Buddy พร้อมแนบรูปกราฟได้

### คำเตือนสำคัญ

Trade Buddy War Room เป็นผู้ช่วยด้านการศึกษาและการบริหารความเสี่ยงเท่านั้น ไม่รับประกันกำไร ไม่เทรดอัตโนมัติ และไม่เชื่อมต่อบัญชี Exchange จริง

### ฟีเจอร์

- หน้าหลัก War Room แบบเน้นแชท
- Agent status bar
- Market Dashboard
- ข้อมูลตลาดสาธารณะ BTCUSDT / ETHUSDT / SOLUSDT
- EMA20 / EMA50 / RSI14
- สถานะตลาดแบบ rule-based
- Risk Calculator
- Setup Checklist
- Trade Journal
- แจ้งเตือน Daily Stop
- แจ้งเตือนแพ้ติดกัน
- แนบรูปกราฟในแชท
- Buddy ตอบแบบ rule-based
- Multi-Agent Discussion + Exit Plan Alert
- Bottom navigation สำหรับมือถือ
- โครงสร้างพร้อมต่อ AI API ในอนาคต

### วิธีติดตั้ง

```bash
npm install
```

### วิธีรันในเครื่อง

```bash
npm run dev
```

### วิธี Build

```bash
npm run build
```

### คู่มือใช้งานสั้น ๆ

1. เปิด War Room แล้วเริ่มที่แชท Buddy
2. ดู Market Dashboard เพื่อเช็ก BTC / ETH / SOL
3. ใช้ Risk Calculator กรอก Entry, Stop Loss, Take Profit
4. เช็ก Setup Checklist ก่อนตัดสินใจ
5. บันทึกผลใน Trade Journal ทุกครั้ง
6. ถ้าวันนี้ขาดทุนถึง -20 บาท หรือแพ้ติดกัน 2 ไม้ ให้พักก่อน

### หมายเหตุเรื่อง AI ในอนาคต

เวอร์ชันนี้ยังไม่ใช้ OpenAI API และไม่ต้องมี environment variables ใด ๆ หากเพิ่ม AI Vision หรือ AI Chat ในอนาคต ต้องเรียกผ่าน server route เท่านั้น และห้ามเปิดเผย API keys บน client
