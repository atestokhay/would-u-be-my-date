# Kahve mi, yemek mi? ☕🍝

"Benimle kahve içmek ya da yemek yemek ister misin?" diye soran küçük, interaktif davet sitesi. [be-my-date](https://github.com/atestokhay/be-my-date) projesinin herkese gönderilebilen genel sürümü.

## Kişiye özel link

Linkin sonuna `?isim=` ekle, sayfa o kişiye ismiyle hitap etsin:

```
https://atestokhay.github.io/kahve-mi-yemek-mi/?isim=Zeynep
```

İsim eklenmezse sayfa genel bir "Selam 👋" ile açılır.

## Akış

1. Davet: "Evet" / kaçan "Hayır" butonu
2. Kahve mi, yemek mi?
3. Yemek seçildiyse: Suşi, Pizza, Burger, Makarna
4. Gün (önümüzdeki 7 gün) ve saat (kahve 14:00–17:00, yemek 18:00–21:00)
5. Cevap WhatsApp mesajı olarak gelir

WhatsApp numarası ve gönderen ismi `script.js` dosyasının en üstündeki `PHONE_NUMBER` ve `SENDER_NAME` değişkenlerinde.
