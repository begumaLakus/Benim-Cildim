# Benim Cildim — Anket Soru Bankası ve Yol Haritası

Bu doküman, Faz 1-3'ü birlikte gözeterek (sağlık/güvenlik, güzellik/kişiselleştirme, ürün satışı) anketin nihai halini oluşturmak için bir çalışma taslağıdır. Dermatoloji/estetisyen konsültasyon pratiği, tanınmış cilt bakımı kişiselleştirme uygulamalarının (Curology, Function of Beauty vb.) yaklaşımı ve KVKK'nın özel nitelikli veri kuralları birlikte değerlendirildi. Sen soruları netleştirdikçe bu listeyi birlikte budayıp son haline getiririz.

## Önce en kritik nokta: bazı sorular "sağlık verisi" sayılıyor

Araştırmama göre KVKK kapsamında alerji, cilt hassasiyeti (tıbbi anlamda) ve hamilelik/hormonal durum bilgileri **özel nitelikli kişisel veri (sağlık verisi)** sayılıyor. Bunun pratik sonucu şu: şu anda WelcomeScreen'de aldığımız genel "fotoğraf KVKK rızası" onayı bu tür sorular için yeterli değil — ayrı ve açık bir rıza gerekiyor. Yani alerji/hamilelik/tıbbi geçmiş gibi soruları ankete eklediğimiz an, anket başlamadan önce (ya da o sorulara gelmeden hemen önce) ikinci bir onay ekranı/checkbox eklememiz gerekecek ("Sağlık ile ilgili bu birkaç soruyu yanıtlamayı, sana daha güvenli bir öneri sunabilmemiz için açık rızamla onaylıyorum" gibi). Aşağıdaki listede bu tür soruları **[Sağlık verisi — ayrı rıza gerekir]** etiketiyle işaretledim, böylece hangi soruların bu ek onayı tetiklediğini net görebilirsin.

İkinci öneri: bu alanları da tıpkı fotoğraflar gibi "işle ve sil" mantığıyla ele alalım — rutin üretildikten sonra ham cevapları uzun süre saklamayalım, gerekirse sadece anonim/istatistiksel özet tutalım. Bu hem KVKK'nın veri minimizasyonu ilkesine hem de zaten kurduğumuz mimariye (fotoğraf silme) tutarlı.

## Faz 1'de zaten sorduklarımız (değişmedi)

Yaş aralığı, cinsiyet, cilt tipi (kuru/yağlı/karma/normal/hassas), cilt endişeleri (akne, kızarıklık, lekeler, ince çizgiler, donukluk, gözenekler), aktif madde kullanımı (evet/hayır), bilinen hassasiyet/alerji (evet/hayır). Bunların hepsi kalıyor; aşağıdaki öneriler bunların bir kısmını derinleştiriyor, bir kısmı da yeni.

## 1. Cilt profili — derinleştirme (senin istediğin iki soru dahil)

- **Ürün içeriği hassasiyeti — detay** _(senin talebin)_ **[Sağlık verisi — ayrı rıza gerekir]**: Mevcut "bilinen hassasiyetin var mı?" sorusu evet ise, takip sorusu olarak hangi içeriklere karşı hassasiyeti olduğunu çoklu seçim ile sormalıyız: parfüm/esans, esansiyel yağlar, alkol, sülfat (SLS/SLES), paraben, silikon, propilen glikol, lanolin, belirli bitkisel özler + serbest metin "diğer" alanı. Bu, sadece "evet/hayır" bilgisinden çok daha kullanışlı — ürün/aktif madde önerirken doğrudan filtre olarak kullanılabilir ve Faz 3'te ürün kataloğu eşleştirmesinde kritik bir güvenlik filtresi olur.
- **Cildin reaktiflik derecesi — detay** _(senin talebin)_: "Cilt tipin" sorusunda zaten "hassas" seçeneği var, ama bunu bir şiddet/derece sorusuna çevirmek daha bilgilendirici: "Cildin yeni bir ürüne veya hava koşullarına karşı ne kadar tepki verir?" → Hiç/Nadiren/Sık sık/Her zaman. Böylece "hassas cilt tipi" ile "genel olarak reaktif cilt" ayrımını yakalarız — biri doku/yağ dengesiyle ilgili, diğeri tolerans eşiğiyle ilgili, ikisi farklı ürün kararları gerektirir.
- **Dermatolojik tanı geçmişi [Sağlık verisi — ayrı rıza gerekir]**: Akne, rozasea, egzama, sedef, melazma gibi teşhis edilmiş bir cilt rahatsızlığın var mı? (çoklu seçim + "yok/belirtmek istemiyorum" seçeneği her zaman açık kalmalı). Bu, öneri motorunun agresif aktif madde önermesini engelleyen bir güvenlik katmanı.
- **Aktif madde kullanımı — detay**: "Aktif madde kullanıyor musun?" evet ise, hangilerini kullandığını sormalıyız (retinol/retinoid, AHA, BHA, C vitamini, niacinamide, benzoil peroksit, azelaik asit). Bu olmadan "aktif madde kullanıyor" bilgisi pratikte işe yaramıyor çünkü öneri motoru çakışan/tekrar eden içerik önermemeli (örn. zaten retinol kullanan birine tekrar retinol önermek ya da AHA+retinol'ü aynı anda önermek cilt bariyerine zarar verebilir).
- **Son 4 haftadaki profesyonel işlemler [Sağlık verisi — ayrı rıza gerekir]**: Botoks, dolgu, kimyasal peeling, lazer gibi bir işlem yaptırdın mı? Bu bilgi olmadan önerilen aktif maddeler (özellikle asit bazlı olanlar) iyileşmekte olan cilde zarar verebilir — estetisyen konsültasyon formlarında bu neredeyse hep sorulan bir soru.
- **Hamilelik/emzirme durumu [Sağlık verisi — ayrı rıza gerekir]**: Sadece cinsiyet "kadın" seçildiyse ve isteğe bağlı ("belirtmek istemiyorum" seçeneğiyle) gösterilmeli. Retinoid ve yüksek doz salisilik asit gibi maddeler hamilelik/emzirme döneminde önerilmemeli; bu soru olmadan bu güvenlik kontrolünü hiç yapamayız.
- **Cilt tonu / güneş tepkisi (Fitzpatrick benzeri, sadeleştirilmiş)**: "Güneşe uzun süre çıktığında cildin genelde ne yapar?" → Hep yanar hiç bronzlaşmaz / Yanar sonra hafif bronzlaşır / Bazen yanar genelde bronzlaşır / Nadiren yanar kolayca bronzlaşır / Hiç yanmaz koyu bronzlaşır. Dermatolojide standart olan Fitzpatrick ölçeğinin basitleştirilmiş hali; SPF önerisi ve pigmentasyon/leke odaklı ürün önerisi için doğrudan girdi.

## 2. Yaşam tarzı & çevre (opsiyonel, atlanabilir olmalı)

Su tüketimi, uyku düzeni, stres, güneşe maruziyet ve yaşanılan iklim/şehir gibi faktörler cilt sağlığını etkiler ve neredeyse tüm profesyonel cilt konsültasyonlarında sorulur. Ancak bunları klinik bir "sağlık" sorusu gibi değil, günlük yaşam tercihi gibi çerçevelemeni öneririm (örn. "Günde ortalama kaç bardak su içersin?" gibi nötr, istatistiksel bir soru) — hem KVKK'nın sağlık verisi yüküne girmeden hem de kullanıcıyı yormadan faydalı sinyal toplarız. Bu kategori tamamen atlanabilir/opsiyonel olmalı; zorunlu tutarsak anket tamamlama oranı düşer.

- Günlük ortalama su tüketimi
- Uyku düzeni (düzenli/düzensiz gibi kaba bir seçenek, saat sormaya gerek yok)
- Güneşe günlük maruziyet süresi ve SPF kullanım alışkanlığı (bu ikisi aslında güvenlik açısından önemli, opsiyonel kategoriden çıkarıp zorunlu tarafa alınabilir)
- Yaşanılan şehir/iklim (nem oranı farklı bakım önerisi gerektirir — İstanbul'un nemli havası ile Ankara'nın kuru havası farklı nemlendirici yoğunluğu ister)

## 3. Hedefler ve tercihler (kişiselleştirme + memnuniyet)

- "Cildinin nasıl görünmesini/hissetmesini istersin?" — serbest öncelik sıralaması değil, kısa çoklu seçim (daha parlak, daha sıkı, lekesiz, aksiyon dolu gözenek kontrolü, sakinleşmiş kızarıklık vb.). Bu, mevcut "cilt endişeleri" sorusunun negatif/problem odaklı halinin pozitif/hedef odaklı karşılığı — ikisi birlikte daha isabetli bir rutin kurgulanmasını sağlar.
- Rutin deneyim seviyesi: "Cilt bakımında kendini nasıl tanımlarsın?" → Yeni başlıyorum / Birkaç ürün kullanıyorum / Deneyimliyim. Önerilen rutinin adım sayısı ve karmaşıklığı buna göre ayarlanmalı — yeni başlayan birine 7 adımlı bir rutin önermek terk oranını artırır.
- Rutine ayırabileceği süre: "Sabah/akşam rutinine kaç dakika ayırabilirsin?" — 2 dakikadan az / 5 dakika / 10+ dakika. Pratik bir kısıt, önerilen adım sayısını doğrudan etkiler.

## 4. Satış/ticari açıdan (Faz 3'ü besleyen sorular)

- **Aylık bakım ürünü bütçesi** _(senin önerin — gerçekten akıllıca)_: Tam tutar yerine aralık sormanı öneririm, hem daha rahat cevaplanır hem daha az hassas bir veri olur: "Aylık cilt bakım ürünlerine ortalama ne kadar ayırıyorsun?" → 300 TL altı / 300-600 TL / 600-1000 TL / 1000 TL üzeri / Belirtmek istemiyorum. Bu bilgi, güzellik merkezinin ürün kataloğunu (Faz 3) fiyat segmentine göre eşleştirmesi için doğrudan kullanılabilir — bütçesi düşük birine 2000 TL'lik serum önermek dönüşüm oranını düşürür.
- Tercih edilen ürün formatı: krem / serum / jel / köpük / yağ — bazı kullanıcılar belirli dokulardan hoşlanmaz (yağlı cilt için jel tercih edilir gibi bir sinyal de verir).
- Koku tercihi: parfümlü olsun / parfümsüz tercih ederim / farketmez — hem tercih hem hassasiyet sinyali (parfüm en yaygın cilt tahriş kaynaklarından biri).
- Vegan/hayvan deneyi yapılmamış ürün tercihi: evet/hayır/farketmez — güzellik merkezinin katalog filtrelemesinde kullanılabilecek bir tercih sinyali.
- Satın alma/tekrar sipariş isteği: "Önerilen ürünleri düzenli aralıklarla (abonelik) almak ister misin?" — Faz 3'teki e-ticaret/abonelik modelini şimdiden test etmek için düşük maliyetli bir sinyal.
- Şu an kullandığı marka(lar) (serbest metin veya bilinen marka listesi + "diğer"): rakip analizi ve çapraz satış fırsatlarını görmek için değerli, ama zorunlu olmamalı.

## 5. Etkileşim/elde tutma için düşünülebilecek (isteğe bağlı, ileri faz)

- Bildirim tercihi: "Rutin hatırlatması ister misin?" (sabah/akşam bildirimleri) — Faz 2/3'te elde tutma için klasik bir soru, ama anketin sonunda ayrı bir izin ekranı olarak da sorulabilir, zorunlu değil.
- Kaç haftada bir "cilt durumu" fotoğrafı çekerek ilerlemeyi takip etmek ister misin? — Faz 2'nin AI analiziyle doğrudan bağlantılı, öncesinde sormaya gerek yok.

## Önceliklendirme özeti

Faz 1'e (şimdi) eklenebilecekler, sağlık verisi OLMAYAN ve düşük sürtünmeli olanlar: cildin reaktiflik derecesi, aktif madde detayı (hangi maddeler), hedef odaklı soru, rutin deneyim seviyesi, rutine ayrılan süre, aylık bütçe aralığı, ürün formatı/koku tercihi. Bunların hiçbiri ek bir KVKK rızası gerektirmiyor, mevcut akışa doğrudan eklenebilir.

Faz 2'ye (foto analiziyle birlikte, ayrı sağlık verisi rızası kurulduktan sonra) bırakılması gerekenler: ürün içeriği hassasiyeti detayı, dermatolojik tanı geçmişi, son 4 haftadaki profesyonel işlemler, hamilelik/emzirme durumu, Fitzpatrick/güneş tepkisi (bu sonuncusu aslında sağlık verisi sayılmayabilir ama temkinli olmakta fayda var). Bu grup için önce ayrı bir "sağlık verisi rızası" ekranı tasarlamamız gerekiyor.

Faz 3'e (ürün kataloğu entegrasyonuyla birlikte) bırakılabilecekler: vegan/marka tercihi, abonelik isteği, mevcut kullanılan marka — bunlar katalog olmadan zaten anlamsız, önceden sorup veriyi boşa biriktirmeye gerek yok.

## Kaynaklar

- [Kişisel Sağlık Verilerinin Korunması — Gün + Partners](https://gun.av.tr/tr/goruslerimiz/guncel-yazilar/kisisel-saglik-verilerinin-korunmasi-1)
- [Özel Nitelikli Kişisel Veri Nedir? — Kvksis](https://kvksis.com/blog-detay/ozel-nitelikli-kisisel-veri-nedir)
- [New Esthetician Consultation Questions — Luminous Skin Lab](https://www.luminousskinlab.com/esthetician-education/new-esthetician-getting-started-guide/client-confidence-consultations/new-esthetician-consultation-questions.php)
- [The science behind our skincare quiz: why it works — Curology](https://curology.com/blog/the-science-behind-our-skincare-quiz-why-it-works/)
- [Fitzpatrick Scale — US Dermatology Partners](https://www.usdermatologypartners.com/fitzpatrick-scale/)
