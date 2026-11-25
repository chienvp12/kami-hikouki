import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { clouds } from './clouds'
import './styles.css'

const asset = name => '/assets/' + name
const example = '久しぶりに一緒にご飯しよう！ずっと行きたかったお店を予約したよ。またたくさん話せるのを楽しみにしてる！'
const kinds = ['デジタルギフト', 'オリジナルギフト']
const filters = ['すべて', '東京エリア', 'ランチ', 'ディナー']
const gifts = [
  { name: 'レストランソラノテーブル', meal: 'ランチ', amount: 8800, photo: '394c4.png', filter: 2 },
  { name: 'メゾン・ド・フルール', meal: 'アフタヌーンティー', amount: 6500, photo: 'f876d.png', filter: 1 },
  { name: '旬彩和食処庵', meal: 'ディナーコース', amount: 12000, photo: '4ad34.png', filter: 3 },
]
const guestOptions = Array.from({ length: 10 }, (_, index) => index + 1)
const giftDetail = (gift, guests) => '（' + guests + '名・' + gift.meal + '）'
const tabs = [
  { label: 'デザイン', img: '0ef8f.svg', options: ['シンプル', 'ナチュラル', 'かわいい'], icons: ['6607b.svg', '57185.svg', '303df.svg'] },
  { label: '紙質', img: '7bdd5.svg', options: ['和紙', 'マット', '光沢'] },
  { label: 'フォント', img: '382d7.svg', options: ['明朝体', 'ゴシック体', 'セリフ'] },
  { label: 'カラー', img: '9a914.svg', options: ['ホワイト', 'ブルー', 'グレー'], colors: ['#ffffff', '#dff0f9', '#efefef'] },
]
const themeBackgrounds = ['5f073.svg', '86121.svg', '872dc.svg']
const sampleName = '夕日の思い出.mp4'
const sampleAddress = '北海道札幌市中央区〇〇8丁目1-1'
const yen = amount => '¥' + amount.toLocaleString('ja-JP')
const stepFromHash = () => /^[1-8]$/.test(location.hash.slice(1)) ? Number(location.hash.slice(1)) : 1

function Icon({ name, size = 16, ...props }) {
  return <img src={asset(name)} alt="" width={size} height={size} className="icon" {...props} />
}

function animateBrandTap(event) {
  if (event.pointerType !== 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const mark = event.currentTarget.querySelector('.brand-mark')
  mark.animate([
    { transform: 'none' },
    { transform: 'translate(2px, -4px) rotate(-2deg) scale(1.015)', offset: 0.38 },
    { transform: 'none' },
  ], { duration: 320, easing: 'ease-out' })
}

function Artwork({ step }) {
  return <div aria-hidden="true" className="artwork">
    {Object.entries(clouds[step - 1]).map(([edge, layers]) =>
      layers.map(([name, left, offset, width, height, transform], index) =>
        <div key={edge + index} className="cloud" style={{ left: left + '%', [edge]: offset, width: width + '%', height }}>
          <img src={asset(name)} alt="" style={{ transform }} />
        </div>,
      ),
    )}
    {step === 1 && <img className="stipple" src={asset('c1405.svg')} alt="" />}
  </div>
}

function Header({ step, close, home }) {
  return <header className={'masthead masthead-' + step}>
    <button className="logo brand-trigger" type="button" aria-label="ホーム" onPointerDown={animateBrandTap} onClick={home}>
      <Icon name="fd5f4.png" size={step === 8 ? 100 : 120} className="icon brand-mark" />
    </button>
    {[3, 6, 8].includes(step) &&
      <button className="close-control" type="button" aria-label="閉じる" onClick={close}>
        <Icon name="0a872.png" size={15} />
      </button>}
  </header>
}

function Navigation({ onHome, show }) {
  return <nav className="bottom-nav panel-shadow" aria-label="メニュー">
    {[
      ['ホーム', '8f16d.svg', onHome],
      ['履歴', '2c34b.png', () => show('履歴')],
      ['設定', '0ab2d.png', () => show('設定')],
    ].map(([label, icon, action]) =>
      <button className="nav-button" type="button" key={label} onClick={action}>
        <Icon name={icon} size={24} />
        {label}
      </button>,
    )}
  </nav>
}

function Actions({ back, forward, next, form, wide = false, edit = false }) {
  return <footer className={'actions ' + (wide ? 'actions-wide' : '')}>
    {back && <button type="button" className="pill bg-paper-sky" onClick={back}>
      {edit && <Icon name="47b52.svg" size={12} />}
      {edit ? '修正する' : 'く  戻る'}
    </button>}
    <button
      type={form ? 'submit' : 'button'}
      form={form}
      className="pill panel-shadow bg-paper-blue"
      onClick={forward}
    >{next}</button>
  </footer>
}

function StepTitle({ title, note, optional, onNote }) {
  return <div className="step-title">
    <h1 className="font-bold">{title}{optional && <small className="text-black/50">（任意）</small>}</h1>
    {onNote
      ? <button type="button" className="step-note" onClick={onNote}>{note}</button>
      : <span className="step-note">{note}</span>}
  </div>
}

function Home({ start, show }) {
  return <>
    <div className="home-brand">
      <div className="home-logo brand-trigger" aria-hidden="true" onPointerDown={animateBrandTap}>
        <Icon name="fd5f4.png" size={307} className="icon brand-mark" />
      </div>
      <h1>大切な人と、<br />特別な食事のきっかけを。</h1>
    </div>
    <div className="home-content">
      {kinds.map((kind, index) => <button
        key={kind}
        type="button"
        className={'gift-entry panel-shadow ' + (index ? 'bg-paper-sky' : 'bg-white')}
        onClick={() => start(index)}
      >
        <Icon name={index ? 'eb277.png' : '27eaa.png'} size={39} />
        <span className="text-[15px]">
          {kind}
          <span className="block text-xs">{index ? '得別な気語ちを込めで' : '気団に難れる'}</span>
        </span>
      </button>)}
      <button type="button" className="see-all" onClick={() => start(1)}>すべて見る</button>
      <section className="home-guide rounded-[20px] bg-white">
        <h2 className="flex items-center justify-center gap-2 text-[15px] font-medium"><Icon name="aafef.svg" size={19} />紙飛行機のお届けステップ</h2>
        <ol className="list-decimal space-y-[9px] ps-[19px] text-xs">
          <li>プラン・デザイン選び</li>
          <li>相手へお届け</li>
          <li>日程調整・予約完了</li>
        </ol>
      </section>
    </div>
    <Navigation onHome={() => window.scrollTo(0, 0)} show={show} />
  </>
}

function Login({ next, home, show }) {
  return <>
    <section className="login-card rounded-[14px] bg-white">
      <h1 className="mb-1 text-[15px]">ログイン</h1>
      <form onSubmit={event => { event.preventDefault(); next() }}>
        <label className="block">
          メールアドレス
          <input className="field login-field border-paper-edge" type="email" placeholder="メールアドレスを入力" autoComplete="email" required />
        </label>
        <label className="mt-2 block">
          パスワード
          <input className="field login-field border-transparent" type="password" placeholder="パスワードを入力" autoComplete="current-password" required />
        </label>
        <button className="ml-auto mt-2 block" type="button" onClick={() => show('パスワードを忘れた方')}>パスワードを忘れた方</button>
        <button className="login-action panel-shadow font-bold" type="submit">ログイン</button>
      </form>
      <button className="login-action" type="button" onClick={next}>Appleでログイン</button>
      <button className="login-action" type="button" onClick={next}>Googleでログイン</button>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        アカウントをお持ちでない方
        <button className="font-bold underline" type="button" onClick={() => show('新規登録')}>新規登録</button>
        <Icon name="8ba3e.svg" size={9} />
      </p>
    </section>
    <Navigation onHome={home} show={show} />
  </>
}

function GiftPhoto({ gift, compact }) {
  const index = gifts.indexOf(gift)
  return <div className={'gift-photo photo-' + index + (compact ? ' photo-compact' : '')}>
    <img src={asset(gift.photo)} alt="" />
  </div>
}

function Catalog({ kind, setKind, filter, setFilter, gift, setGift, guestCounts, setGuestCounts, next }) {
  const [touched, setTouched] = useState(false)
  const displayed = gifts.filter(item => filter < 2 || item.filter === filter)
  function chooseGift(item) {
    setGift(item)
    setTouched(true)
  }

  function chooseGuestCount(item, count) {
    setGuestCounts(previous => ({ ...previous, [item.name]: count }))
    chooseGift(item)
  }

  function chooseFilter(index) {
    setFilter(index)
    const matching = gifts.find(item => item.filter === index)
    if (index >= 2 && gift.filter !== index && matching) setGift(matching)
  }
  return <>
    <div className="catalog-content">
      <div className="catalog-tabs surface" role="group" aria-label="ギフトの種類">
        {kinds.map((label, index) => <button
          type="button" key={label} aria-pressed={index === kind}
          className={'rounded-full ' + (index === kind ? 'bg-paper-sky font-bold' : '')}
          onClick={() => setKind(index)}
        >{label}</button>)}
      </div>
      <h1 className="mt-[13px] font-bold">ギフトの種類</h1>
      <div className="catalog-select-wrap">
        <select aria-label="ギフトの種類" className="catalog-select surface">
          <option>レストラン</option>
        </select>
        <Icon name="14b43.svg" size={10} />
      </div>
      <div className="filters" role="group" aria-label="絞り込み">
        {filters.map((label, index) => <button key={label} type="button" aria-pressed={filter === index}
          className={'chip ' + (filter === index ? 'bg-paper-blue' : 'bg-white')}
          onClick={() => chooseFilter(index)}
        >{label}</button>)}
      </div>
      <div className="gift-list">
        {displayed.map(item => {
          const guests = guestCounts[item.name] ?? 2
          return <div key={item.name} className={'gift-card surface panel-shadow ' + (touched && gift === item ? 'is-picked' : '')}>
            <GiftPhoto gift={item} />
            <div className="min-w-0 grow">
              <button type="button" aria-pressed={gift === item} className="gift-card-choice" onClick={() => chooseGift(item)}>
                <strong>{item.name}</strong>
              </button>
              <div className="guest-picker">
                <span aria-hidden="true">{giftDetail(item, guests)}</span>
                <Icon name="14b43.svg" size={10} />
                <select aria-label={item.name + 'の人数'} value={guests}
                  onChange={event => chooseGuestCount(item, Number(event.target.value))}>
                  {guestOptions.map(count => <option key={count} value={count}>{count}名</option>)}
                </select>
              </div>
              <b>{yen(item.amount)}</b> <span className="text-[8px]">（税込）</span>
            </div>
          </div>
        })}
      </div>
    </div>
    <Actions forward={next} next="次へ進む" wide />
  </>
}

function Invitation({ options, message, sender, mode }) {
  const [theme, paper, typeface, color] = options
  const design = mode === 'design'
  const compact = mode === 'compact'
  const note = sender ? '一' + sender + 'より' : compact ? '一花子より' : '一〇〇より'
  const variant = {
    ...(color > 0 && { backgroundColor: tabs[3].colors[color] }),
    ...(typeface > 0 && { fontFamily: typeface === 1 ? 'sans-serif' : 'serif' }),
  }
  const content = <div className={'invite-paper ' + (paper ? 'paper-finish-' + paper : '')} style={variant}>
    <p className={'invite-title ' + (design || compact ? 'text-center' : '')}>SPECIAL INVITATION</p>
    {design ? <>
      <p className="invite-name text-center font-bold text-black/30">招待状</p>
      <div className="invite-emblem" key={theme}>
        <Icon name={theme === 0 ? 'a68d9.svg' : tabs[0].icons[theme]} size={33} />
      </div>
      <p className="invite-line text-right font-bold text-black/30">大切な時間を一緒にお過ごしください</p>
    </> : <div className="invite-message text-center font-bold text-black/30">
      {theme > 0 && <Icon className="invite-watermark" name={tabs[0].icons[theme]} size={33} />}
      <p>{message}</p>
      <p className="invite-signature text-right">{note}</p>
    </div>}
  </div>
  if (compact) return <div className="invite-compact">{content}</div>
  return <section className="invite-preview panel-shadow">
    <div className="invite-border panel-shadow">{content}</div>
    <p className="invite-caption text-black/30">
      {design && <Icon name="1e26c.png" size={26} />}
      {design ? 'リアルタイムプレビュー' : '招待状に印字されるイメージです'}
    </p>
  </section>
}

function Design({ options, setOptions, kind, back, next }) {
  const [tab, setTab] = useState(0)
  return <>
    <div className="standard-content">
      <StepTitle title="招待状をデザインする" note={kinds[kind]} />
      <Invitation mode="design" options={options} />
      <section className="design-panel surface">
        <div className="design-panel-header">
          <h2 className="flex items-center gap-1 font-bold"><Icon name="cf6cd.png" size={17} />選べる項目</h2>
          <span className="chip bg-paper-blue font-bold">{tabs[tab].label}選択</span>
        </div>
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="選べる項目">
          {tabs.map(({ label, img }, index) => <button
            type="button" key={label} className={'design-option ' + (tab === index ? 'tab-active' : '')}
            aria-pressed={tab === index} onClick={() => setTab(index)}
          >
            <Icon name={img} size={index === 3 ? 14 : 18} />{label}
          </button>)}
        </div>
      </section>
      <section className="design-panel choice-panel surface">
        <h2>{tab === 0 ? 'イラスト・テーマを選択してください' : tabs[tab].label}</h2>
        <div className="choice-grid" role="group" aria-label={tabs[tab].label}>
          {tabs[tab].options.map((label, index) => <button
            key={label} type="button" className={'design-option ' + (options[tab] === index ? 'choice-active' : '')}
            aria-pressed={options[tab] === index}
            style={tab === 0 ? { backgroundImage: 'url(' + asset(themeBackgrounds[options[0] === index ? 0 : index === 2 ? 2 : 1]) + ')' } : undefined}
            onClick={() => setOptions(options.map((value, key) => key === tab ? index : value))}
          >
            {tabs[tab].icons && <Icon name={tabs[tab].icons[index]} size={23} />}
            {tabs[tab].colors && <span className="swatch" style={{ backgroundColor: tabs[tab].colors[index] }} />}
            {label}
          </button>)}
        </div>
      </section>
    </div>
    <Actions back={back} forward={next} next="次へ進む む（メッセージ )     ＞" />
  </>
}

function Message({ options, message, setMessage, sender, setSender, back, next, show }) {
  return <>
    <div className="standard-content">
      <StepTitle title="メッセージを作成する" note="自分の言葉で伝える" />
      <Invitation mode="message" options={options} message={message} sender={sender} />
      <section className="message-panel outlined">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <label htmlFor="message">メッセージを入力</label>
          <span><span className="text-paper-ink">{Array.from(message).length}</span>/100文字</span>
        </div>
        <textarea id="message" className="message-input" value={message}
          onChange={event => setMessage(Array.from(event.target.value).slice(0, 100).join(''))} />
        <button type="button" className="chip bg-paper-blue font-bold" onClick={() => show('例文から選ぶ')}>
          <Icon name="ae155.png" size={17} />例文から選ぶ
        </button>
      </section>
      <section className="sender-panel outlined">
        <label className="flex items-center gap-1 text-[11px] font-bold" htmlFor="sender">
          <Icon name="a8bbd.png" size={15} />差出人の 名前（任意）
        </label>
        <input id="sender" className="field" placeholder="例：太郎" value={sender} maxLength={30}
          onChange={event => setSender(event.target.value)} />
      </section>
    </div>
    <Actions back={back} forward={next} next="次へ進む （動画添え） ＞" />
  </>
}

function QrStrip({ confirmed }) {
  return <div className="qr-strip">
    <span className="qr-icon"><Icon name="fca53.png" size={28} /></span>
    <div className="min-w-0 grow">
      <p className="text-[11px] font-bold">{confirmed ? '動画QRコード印字済み' : 'カードにQRコードを印刷！'}</p>
      <p className="text-[10px] font-medium text-black/50">{confirmed ? 'スマホで読み取って再生' : '相手がスマホで読み取って再生可能'}</p>
    </div>
    <span className={'chip shrink-0 ' + (confirmed ? 'bg-paper-edge' : 'bg-paper-blue')}>{confirmed ? '添付あり' : '自動生成'}</span>
  </div>
}

function VideoStep({ video, setVideo, fileInput, onFile, show, back, next }) {
  return <>
    <div className="standard-content video-content">
      <StepTitle title="動画を添える" note="スキップ可能" optional onNote={() => { setVideo(null); next() }} />
      <section className="video-explainer surface">
        <h2 className="flex items-center gap-1 text-[11px] font-bold">
          <Icon name="dda5e.png" size={17} />特別な気持ちを動画で伝えられます
        </h2>
        <p className="mt-1 ps-[2px] text-[10px] text-black/50">添付すると、招待状のQRコードを読み取ることでスマホから動画を再生できます。</p>
      </section>
      <div className="video-panel rounded-[10px] bg-white panel-shadow">
        {video?.url
          ? <video className="video-poster" src={video.url} controls playsInline />
          : <button type="button" className="video-poster panel-shadow" onClick={() => show('メッセージ動画')} aria-label="メッセージ動画">
            <img src={asset('05b7e.png')} alt="" />
          </button>}
        <QrStrip />
      </div>
      <section className="upload-panel outlined">
        <input ref={fileInput} type="file" className="sr-only" tabIndex={-1} aria-label="動画を選択する"
          accept=".mp4,.mov,video/mp4,video/quicktime" onChange={onFile} />
        <button type="button" className="upload-target" onClick={() => fileInput.current.click()}>
          <Icon name="92edf.svg" size={43} />
          {video?.url ? video.name : '動画を選択する'}
        </button>
        <p className="text-center text-[10px] text-black/50">（最大1本・30秒以内/MP4,MOV対応）</p>
      </section>
      <section className="sample-panel outlined">
        <h2 className="flex items-center gap-1 text-[11px] font-bold"><Icon name="dda5e.png" size={17} />サンプル動画から試す</h2>
        <div className="grid grid-cols-3 gap-[7px]">
          {[0, 1, 2].map(index => <button
            key={index} type="button" className="sample-slot"
            aria-label={'サンプル動画 ' + (index + 1)} aria-pressed={video?.sample === index}
            onClick={() => setVideo({ sample: index, name: sampleName })}
          />)}
        </div>
      </section>
    </div>
    <Actions back={back} forward={next} next="次へ進む （プレビュー）＞" />
  </>
}

function Review({ options, message, sender, video, gift, guests, kind, edit, next }) {
  const values = [
    ['ギフト内', gift.name + ' （' + guests + '名）'],
    ['カードデザイン', options[0] === 0 ? 'シンプル（紙飛行機）' : tabs[0].options[options[0]]],
    ['紙質・フォント', tabs[1].options[options[1]] + '/' + tabs[2].options[options[2]]],
    ['メッセージ', message ? '「' + Array.from(message).slice(0, 5).join('') + '...」' : '—'],
    ...(video ? [['QRコード（動画）', video.name]] : []),
  ]
  return <>
    <div className="standard-content review-content">
      <StepTitle title="プレビューを確認する" note="最終チェック" />
      <div className="review-information surface">
        <Icon name="90ac6.png" size={14} />
        すべての内容を確認し、送信前に最終チェックを行います。
      </div>
      <section className="review-card rounded-[10px] bg-white panel-shadow">
        <div className="flex items-center justify-between gap-1">
          <h2 className="flex items-center gap-1 font-bold"><Icon name="1e26c.png" size={16} />完成イメージ</h2>
          <span className="chip bg-paper-blue">{kind ? 'オリジナル招待状' : kinds[0]}</span>
        </div>
        <div className="review-gift">
          <GiftPhoto gift={gift} compact />
          <div>
            <b>{gift.name}</b>
            <p className="text-[10px] font-medium text-black/50">{giftDetail(gift, guests)}</p>
            <p className="text-[10px]"><b>{yen(gift.amount)}</b><span className="text-black/50">（税込）</span></p>
          </div>
        </div>
        <Invitation mode="compact" options={options} message={message} sender={sender} />
        {video && <QrStrip confirmed />}
      </section>
      <section className="review-check outlined">
        <div className="review-check-heading">
          <h2 className="flex items-center gap-1 font-bold"><Icon name="cf6cd.png" size={16} />確認できる内</h2>
          <p className="font-medium text-paper-ink">全項目入力完了</p>
        </div>
        <dl className="grid gap-[5px]">
          {values.map(([label, value]) => <div className="review-row" key={label}>
            <dt className="flex shrink-0 items-center gap-1 font-bold"><Icon name="52708.svg" size={16} />{label}</dt>
            <dd className={label === 'QRコード（動画）' ? 'text-paper-ink' : ''}>{value}</dd>
          </div>)}
        </dl>
      </section>
    </div>
    <Actions back={edit} forward={next} next="配送先確定へ進む  ＞" edit />
  </>
}

function Checkout({ gift, guests, delivery, setDelivery, sample, setSample, payment, setPayment, back, order }) {
  const set = (key, value) => setDelivery(previous => ({ ...previous, [key]: value }))
  const payments = [
    ['クレジットカード', 'b7b09.svg', 20],
    ['Apple Pay', 'apple', 32],
    ['PayPay', 'a4d48.svg', 16],
  ]
  const checkoutFields = [
    ['recipient', 'お届け先の名前', 'text', 'shipping name'],
    ['name', 'お届け先の名前', 'text', 'name'],
    ['address', '住所', 'text', 'street-address'],
    ['telephone', '電話番号', 'tel', 'tel'],
  ]
  return <>
    <div className="standard-content checkout-content">
      <h1 className="checkout-title">配送先を確定して購入する</h1>
      <form id="delivery-form" onSubmit={event => { event.preventDefault(); order() }}>
        <div className="address-card rounded-[10px] bg-white panel-shadow">
          {checkoutFields.map(([key, label, type, autoComplete]) => <div key={key}>
            <label className="mb-1 block" htmlFor={key}>{label}</label>
            <div className="flex gap-[9px]">
              <input id={key} className="field min-w-0 flex-1" type={type} autoComplete={autoComplete}
                value={delivery[key]} onChange={event => set(key, event.target.value)} required />
              {key === 'name' &&
                <button type="button" className="address-button" onClick={() => set('address', sampleAddress)}>住所自動入力</button>}
            </div>
          </div>)}
        </div>
        <label className="sample-delivery outlined">
          <input type="checkbox" className="sample-check" checked={sample} onChange={event => setSample(event.target.checked)} />
          <span className="sample-label font-medium">サンプルを自宅に配送（別途料金）</span>
          <span className="chip bg-paper-blue">+ ¥1,000</span>
          <span className="sample-detail text-black/50">発送前に実際の仕上がりを自宅で確認できます。</span>
        </label>
        <section className="payment-card outlined">
          <div className="payment-heading">
            <h2 className="flex items-center gap-1 font-bold"><Icon name="f9bc1.svg" size={14} />お支払い金額</h2>
            <b>{yen(gift.amount)}</b>
          </div>
          <p className="mt-[10px] font-medium">{gift.name}{giftDetail(gift, guests)}</p>
          <div className="shipping-fee">
            <span>招待状制作・郵送料</span><span className="text-paper-ink">無料</span>
          </div>
          <p className="my-[9px] flex items-center justify-between font-bold">
            合計（税込） <span className="text-[14px] text-paper-ink">{yen(gift.amount + (sample ? 1000 : 0))}</span>
          </p>
          <p className="text-[10px] font-medium text-[#808080]">お支払い方法</p>
          <div className="payment-methods" role="group" aria-label="お支払い方法">
            {payments.map(([label, icon, size], index) => <button
              key={label} type="button" aria-pressed={payment === index}
              className="payment-method" onClick={() => setPayment(index)}
            >
              {icon === 'apple'
                ? <Icon name="38f3d.svg" size={32} className="apple-pay" />
                : <Icon name={icon} size={size} />}
              {label}
            </button>)}
          </div>
        </section>
      </form>
    </div>
    <Actions back={back} next="購入を確定する" form="delivery-form" />
  </>
}

function Modal({ modal, close, applyExample, video }) {
  const ref = useRef(null)
  useEffect(() => {
    if (modal && !ref.current.open) ref.current.showModal()
    if (!modal && ref.current.open) ref.current.close()
  }, [modal])
  return <dialog ref={ref} className="modal outlined panel-shadow" onClose={close}
    onClick={event => { if (event.target === event.currentTarget) close() }}>
    {modal && <section className="p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold">{modal}</h2>
        <button type="button" className="rounded-full p-2" aria-label="閉じる" onClick={close}><Icon name="0a872.png" size={15} /></button>
      </div>
      {modal === '例文から選ぶ' && <button type="button" className="rounded-[10px] bg-paper-sky p-3 text-left" onClick={applyExample}>{example}</button>}
      {modal === 'メッセージ動画' && (video?.url
        ? <video src={video.url} controls autoPlay playsInline />
        : <img className="sample-preview" src={asset('05b7e.png')} alt="メッセージ動画" />)}
      {modal === '履歴' && <p>履歴はありません。</p>}
      {modal === '設定' && <p>Kami-Hikouki</p>}
      {modal === 'パスワードを忘れた方' && <p>デモではパスワードの再設定は行われません。</p>}
      {modal === '新規登録' && <p>デモではアカウントは作成されません。</p>}
      {modal === '動画を選択する' && <p>30秒以内で再生可能なMP4またはMOVを選択してください。</p>}
      {modal === '購入を確定する' && <p>入力内容の確認が完了しました。デモのため決済や配送は行われません。</p>}
    </section>}
  </dialog>
}

function App() {
  const [step, setStep] = useState(stepFromHash)
  const [kind, setKind] = useState(1)
  const [filter, setFilter] = useState(0)
  const [gift, setGift] = useState(gifts[0])
  const [guestCounts, setGuestCounts] = useState({})
  const [options, setOptions] = useState([0, 0, 0, 0])
  const [message, setMessage] = useState(example)
  const [sender, setSender] = useState('')
  const [video, setVideo] = useState({ sample: 0, name: sampleName })
  const [modal, setModal] = useState('')
  const [sample, setSample] = useState(false)
  const [payment, setPayment] = useState(0)
  const [delivery, setDelivery] = useState({ recipient: '山田 花子', name: '山田 花子', address: sampleAddress, telephone: '090-1234-5678' })
  const fileInput = useRef(null)
  const fileRequest = useRef(0)
  const screen = useRef(null)

  useEffect(() => {
    const syncStep = () => setStep(stepFromHash())
    window.addEventListener('hashchange', syncStep)
    window.addEventListener('popstate', syncStep)
    return () => {
      window.removeEventListener('hashchange', syncStep)
      window.removeEventListener('popstate', syncStep)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    screen.current?.focus({ preventScroll: true })
  }, [step])

  useEffect(() => {
    const url = video?.url
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [video?.url])

  function go(next) {
    if (next === step) return
    if (step === 6) fileRequest.current++
    setModal('')
    history.pushState(null, '', next === 1 ? location.pathname + location.search : '#' + next)
    setStep(next)
  }

  function start(nextKind) {
    setKind(nextKind)
    go(2)
  }

  async function onFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const request = ++fileRequest.current
    if (!/\.(mp4|mov)$/i.test(file.name)) {
      setModal('動画を選択する')
      return
    }
    const url = URL.createObjectURL(file)
    const duration = await new Promise(resolve => {
      const probe = document.createElement('video')
      const finish = value => {
        clearTimeout(timer)
        probe.onloadedmetadata = null
        probe.onerror = null
        probe.removeAttribute('src')
        probe.load()
        resolve(value)
      }
      const timer = setTimeout(() => finish(NaN), 8000)
      probe.preload = 'metadata'
      probe.onloadedmetadata = () => finish(probe.duration)
      probe.onerror = () => finish(NaN)
      probe.src = url
    })
    if (request === fileRequest.current && Number.isFinite(duration) && duration > 0 && duration <= 30) {
      setVideo({ name: file.name, url })
    } else {
      URL.revokeObjectURL(url)
      if (request === fileRequest.current) setModal('動画を選択する')
    }
  }

  const home = () => go(1)
  const next = () => go(step + 1)
  const back = () => go(step - 1)
  const guests = guestCounts[gift.name] ?? 2
  const views = {
    1: <Home start={start} show={setModal} />,
    2: <Login next={next} home={home} show={setModal} />,
    3: <Catalog {...{ kind, setKind, filter, setFilter, gift, setGift, guestCounts, setGuestCounts, next }} />,
    4: <Design {...{ options, setOptions, kind, back, next }} />,
    5: <Message {...{ options, message, setMessage, sender, setSender, back, next }} show={setModal} />,
    6: <VideoStep {...{ video, setVideo, fileInput, onFile, back, next }} show={setModal} />,
    7: <Review {...{ options, message, sender, video, gift, guests, kind, next }} edit={back} />,
    8: <Checkout {...{ gift, guests, delivery, setDelivery, sample, setSample, payment, setPayment, back }} order={() => setModal('購入を確定する')} />,
  }
  return <div className="app-frame">
    <Artwork step={step} />
    <main className={'screen screen-' + step} key={step} ref={screen} tabIndex={-1}>
      {step > 1 && <Header step={step} close={home} home={home} />}
      {views[step]}
    </main>
    <Modal modal={modal} video={video} close={() => setModal('')}
      applyExample={() => { setMessage(example); setModal('') }} />
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
