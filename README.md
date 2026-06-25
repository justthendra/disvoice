# DisVoice

## Proje Hakkında

DisVoice, Discord bot geliştiricileri için geliştirilmiş açık kaynaklı bir müzik oynatıcı modülüdür. Proje; YouTube, Spotify, SoundCloud ve benzeri platformlardan ses oynatmayı destekleyerek geliştiricilerin hızlı ve kolay şekilde müzik botları oluşturabilmesini amaçlamaktadır.

Bu proje, yaygın olarak kullanılan müzik kütüphanelerinin güncelliğini yitirmesi ve aktif olarak geliştirilmemesi nedeniyle alternatif bir çözüm sunmak amacıyla geliştirilmiştir.

## Proje Amacı

Discord bot geliştiricilerinin müzik sistemi geliştirme sürecini kolaylaştırmak, bakım yapılabilir ve genişletilebilir bir altyapı sunmak.

DisVoice sayesinde geliştiriciler düşük seviyeli ses işlemleriyle uğraşmadan kendi müzik botlarını oluşturabilirler.

## Kullanılan Teknolojiler

- TypeScript
- Node.js
- Discord.js
- @discordjs/voice
- play-dl
- youtubei.js
- yt-dlp
- ffmpeg
- SoundCloud API
- Spotify URL Parser

## Klasör Yapısı

```text
disvoice/
├── dist/           # Derlenmiş JavaScript dosyaları
├── examples/       # Kullanım örnekleri
├── src/            # Kaynak kodlar
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## Kurulum

```bash
git clone https://github.com/kodikasorg/disvoice.git
cd disvoice
npm install
npm run build
```

## Kullanım

Örnek kullanım dosyaları `examples` klasörü içerisinde bulunmaktadır.

Temel kullanım adımları:

1. Discord botunuzu oluşturun.
2. Discord.js v14 kurulumunu tamamlayın.
3. DisVoice modülünü projeye ekleyin.
4. Ses kanalına bağlanın.
5. İstenen platformdan müzik oynatın.

## Desteklenen Platformlar

- YouTube
- Spotify
- SoundCloud

## GitHub Bağlantısı

https://github.com/kodikasorg/disvoice

## Lisans

Bu proje MIT lisansı altında yayınlanmaktadır.

## Kaynaklar

- https://discord.js.org
- https://discordjs.guide
- https://nodejs.org
- https://www.typescriptlang.org
