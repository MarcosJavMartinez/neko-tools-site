"use strict";

/* ==========================================================================
   Idiomas disponibles y motor de traducción — mismo patrón que usa
   i18n.js en el repo de Neko Lista (la app), para que ambos productos se
   sientan consistentes.
   ========================================================================== */

const LANGUAGES = [
  { code: "es", nativeName: "Español", flag: "🇪🇸" },
  { code: "en", nativeName: "English", flag: "🇬🇧" },
  { code: "pt", nativeName: "Português", flag: "🇧🇷" },
  { code: "tr", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "ru", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", nativeName: "日本語", flag: "🇯🇵" },
];

const LANG_KEY = "nekoTools.lang";

const TRANSLATIONS = {
  es: {
    nav_neko_lista: "Neko Lista",
    nav_proximamente: "Próximamente",
    nav_sobre: "Sobre",
    nav_abrir: "Abrir Neko Lista",
    theme_to_dark_aria: "Cambiar a modo oscuro",
    theme_to_light_aria: "Cambiar a modo día",
    nav_toggle_open_aria: "Abrir menú",
    nav_toggle_close_aria: "Cerrar menú",
    lang_toggle_aria: "Cambiar idioma",

    hero_kicker: "Neko Lista · lista de compras",
    hero_h1: "La lista del súper que <em>sabe contar</em>.",
    hero_lede: "Cantidades, precios y el total de tu compra, actualizados en el momento. Sin cuenta, sin anuncios, sin vueltas.",
    tag_gratis: "Gratis",
    tag_sin_cuenta: "Sin cuenta",
    tag_instalable: "Instalable",
    hero_cta_ver_funciones: "Ver funciones",
    hero_cta_compartir: "Compartir",
    share_text: "Neko Lista: la lista de compras que calcula el total en el momento.",
    share_toast_copied: "Enlace copiado",
    share_copy_manual: "Copiá este enlace para compartirlo:",
    float1_k: "Se actualiza",
    float1_v: "al instante",
    float2_k: "Menos pensar",
    float2_v: "más tiempo para vos",
    hero_screenshot_alt: "Captura real de Neko Lista: lista de compras con Leche, Pan, Huevos, Tomate, Banana, Pollo, Arroz y Papel higiénico, total $18.900.",

    features_kicker: "Por qué se siente distinta",
    features_h2: "Tres detalles que la gente nota apenas la abre.",
    features_lede: "Nada de fricción: abrís, agregás, comprás.",
    feat1_h3: "Calcula el total en tiempo real",
    feat1_p: "Ves cuánto llevás gastado al instante, sin sacar la calculadora.",
    feat2_h3: "Lista simple y rápida",
    feat2_p: "Agregá, editá y tachá productos en segundos, con una mano libre.",
    feat3_h3: "Diseño claro para comprar mejor",
    feat3_p: "Todo bien ordenado, sin enredos ni pasos de más.",

    receipt_kicker: "Gasto, línea por línea",
    receipt_h2: "Todo lo que llevás, línea por línea.",
    receipt_lede: "Ves cuánto llevás gastado antes de llegar a la caja, como un recibo que se arma solo.",
    receipt_sub: "TICKET · LISTA ACTUAL",
    receipt_total: "Total",

    gallery_kicker: "Así se ve, sin maquillaje",
    gallery_h2: "Capturas reales de la app.",
    gallery_lede: "Tres pantallas, tres momentos de la compra.",
    gal1_h3: "Tu lista",
    gal1_p: "Todo lo que necesitás, siempre a mano.",
    gal1_alt: "Captura real de la lista de compras con productos, cantidades y precios.",
    gal2_h3: "Agregá en segundos",
    gal2_p: "Nombre, cantidad y precio. Nada más.",
    gal2_alt: "Captura real del formulario para agregar un producto: nombre, cantidad y precio.",
    gal3_h3: "Tus íconos",
    gal3_p: "Personalizá tu lista a tu manera.",
    gal3_alt: "Captura real del selector de íconos de producto.",

    gondola_slot: "Más herramientas, pronto",
    gondola_h2: "Neko Lista es la primera. No la única.",
    gondola_p: "Estamos creando herramientas simples para la vida real, bajo un mismo techo: Neko Tools.",
    gondola_cta: "Conocer Neko Tools",
    box_aria: "Ver un adelanto de las próximas herramientas",
    box_closed_alt: "Una caja de cartón cerrada con cinta verde y un sticker de gato: las próximas herramientas de Neko Tools, en camino.",

    final_h2: "¿Listo para una compra más simple?",
    final_p: "Neko Lista te acompaña, del changuito al total.",
    final_apoyar: "Apoyar",
    final_mascot_alt: "El gato de Neko Tools caminando y sonriendo, con una bolsa de compras llena de verduras, pan y leche.",

    about_kicker: "Quiénes somos",
    about_h2: "Un desarrollador, no una empresa.",
    about_p1: "Neko Tools lo armo y lo mantengo yo solo. Programo cosas que primero necesito yo: Neko Lista nació porque no encontraba una lista de compras simple, sin cuenta ni anuncios, que hiciera bien una sola cosa.",
    about_p2: "Si encontraste un bug, te falta una función, o simplemente querés contarme qué te parece la app, escribime — leo todos los mensajes.",
    about_role: "Desarrollador de Neko Tools · Argentina",

    contact_h3: "Mandame un mensaje",
    contact_lede: "Te respondo por mail, normalmente en un día o dos.",
    contact_label_name: "Nombre",
    contact_label_email: "Tu email",
    contact_label_message: "Mensaje",
    contact_submit: "Enviar mensaje",
    contact_status_sending: "Enviando…",
    contact_status_ok: "¡Gracias! Te voy a responder por mail.",
    contact_status_error: "No se pudo enviar. Probá de nuevo o escribime directo por Ko-fi.",

    footer_tagline: "Herramientas simples para la vida real. Hecho con 💚 en Argentina.",
  },

  en: {
    nav_neko_lista: "Neko Lista",
    nav_proximamente: "Coming up",
    nav_sobre: "About",
    nav_abrir: "Open Neko Lista",
    theme_to_dark_aria: "Switch to dark mode",
    theme_to_light_aria: "Switch to light mode",
    nav_toggle_open_aria: "Open menu",
    nav_toggle_close_aria: "Close menu",
    lang_toggle_aria: "Change language",

    hero_kicker: "Neko Lista · shopping list",
    hero_h1: "The grocery list that <em>knows how to count</em>.",
    hero_lede: "Quantities, prices and your running total, updated the moment you add something. No account, no ads, no fuss.",
    tag_gratis: "Free",
    tag_sin_cuenta: "No account",
    tag_instalable: "Installable",
    hero_cta_ver_funciones: "See features",
    hero_cta_compartir: "Share",
    share_text: "Neko Lista: the shopping list that adds up your total as you go.",
    share_toast_copied: "Link copied",
    share_copy_manual: "Copy this link to share it:",
    float1_k: "Updates",
    float1_v: "instantly",
    float2_k: "Less thinking",
    float2_v: "more time for you",
    hero_screenshot_alt: "Real screenshot of Neko Lista: a shopping list with Milk, Bread, Eggs, Tomato, Banana, Chicken, Rice and Toilet paper, total $18,900.",

    features_kicker: "Why it feels different",
    features_h2: "Three details people notice the moment they open it.",
    features_lede: "No friction: open it, add items, go shopping.",
    feat1_h3: "Calculates the total in real time",
    feat1_p: "See how much you've spent instantly, no calculator needed.",
    feat2_h3: "Simple, fast list",
    feat2_p: "Add, edit and check off items in seconds, one-handed.",
    feat3_h3: "Clear design for smarter shopping",
    feat3_p: "Everything neatly organized, no clutter, no extra steps.",

    receipt_kicker: "Spending, line by line",
    receipt_h2: "Everything you're carrying, line by line.",
    receipt_lede: "See how much you're spending before you reach the register, like a receipt that writes itself.",
    receipt_sub: "RECEIPT · CURRENT LIST",
    receipt_total: "Total",

    gallery_kicker: "See it as it really is",
    gallery_h2: "Real screenshots of the app.",
    gallery_lede: "Three screens, three moments of a shopping trip.",
    gal1_h3: "Your list",
    gal1_p: "Everything you need, always at hand.",
    gal1_alt: "Real screenshot of the shopping list with products, quantities and prices.",
    gal2_h3: "Add items in seconds",
    gal2_p: "Name, quantity and price. Nothing else.",
    gal2_alt: "Real screenshot of the add-product form: name, quantity and price.",
    gal3_h3: "Your icons",
    gal3_p: "Personalize your list your way.",
    gal3_alt: "Real screenshot of the product icon picker.",

    gondola_slot: "More tools, coming soon",
    gondola_h2: "Neko Lista is the first. Not the only one.",
    gondola_p: "We're building simple tools for real life, all under one roof: Neko Tools.",
    gondola_cta: "Get to know Neko Tools",
    box_aria: "See a preview of the upcoming tools",
    box_closed_alt: "A closed cardboard box with green tape and a cat sticker: Neko Tools' upcoming tools, on their way.",

    final_h2: "Ready for a simpler shop?",
    final_p: "Neko Lista is with you from cart to checkout.",
    final_apoyar: "Support",
    final_mascot_alt: "The Neko Tools cat walking and smiling, carrying a shopping bag full of vegetables, bread and milk.",

    about_kicker: "About us",
    about_h2: "A developer, not a company.",
    about_p1: "I build and maintain Neko Tools on my own. I make things I need myself first: Neko Lista exists because I couldn't find a simple shopping list, with no account and no ads, that did one thing well.",
    about_p2: "If you found a bug, are missing a feature, or just want to tell me what you think of the app, write to me — I read every message.",
    about_role: "Developer of Neko Tools · Argentina",

    contact_h3: "Send me a message",
    contact_lede: "I reply by email, usually within a day or two.",
    contact_label_name: "Name",
    contact_label_email: "Your email",
    contact_label_message: "Message",
    contact_submit: "Send message",
    contact_status_sending: "Sending…",
    contact_status_ok: "Thanks! I'll reply by email.",
    contact_status_error: "Couldn't send it. Try again, or reach me directly through Ko-fi.",

    footer_tagline: "Simple tools for real life. Made with 💚 in Argentina.",
  },

  pt: {
    nav_neko_lista: "Neko Lista",
    nav_proximamente: "Em breve",
    nav_sobre: "Sobre",
    nav_abrir: "Abrir Neko Lista",
    theme_to_dark_aria: "Mudar para modo escuro",
    theme_to_light_aria: "Mudar para modo claro",
    nav_toggle_open_aria: "Abrir menu",
    nav_toggle_close_aria: "Fechar menu",
    lang_toggle_aria: "Mudar idioma",

    hero_kicker: "Neko Lista · lista de compras",
    hero_h1: "A lista do mercado que <em>sabe contar</em>.",
    hero_lede: "Quantidades, preços e o total da sua compra, atualizados na hora. Sem conta, sem anúncios, sem complicação.",
    tag_gratis: "Grátis",
    tag_sin_cuenta: "Sem conta",
    tag_instalable: "Instalável",
    hero_cta_ver_funciones: "Ver funções",
    hero_cta_compartir: "Compartilhar",
    share_text: "Neko Lista: a lista de compras que soma o total na hora.",
    share_toast_copied: "Link copiado",
    share_copy_manual: "Copie este link para compartilhar:",
    float1_k: "Atualiza",
    float1_v: "na hora",
    float2_k: "Menos pensar",
    float2_v: "mais tempo pra você",
    hero_screenshot_alt: "Captura real do Neko Lista: lista de compras com Leite, Pão, Ovos, Tomate, Banana, Frango, Arroz e Papel higiênico, total $18.900.",

    features_kicker: "Por que ela é diferente",
    features_h2: "Três detalhes que as pessoas notam assim que abrem.",
    features_lede: "Sem fricção: abre, adiciona, compra.",
    feat1_h3: "Calcula o total em tempo real",
    feat1_p: "Você vê quanto já gastou na hora, sem precisar de calculadora.",
    feat2_h3: "Lista simples e rápida",
    feat2_p: "Adicione, edite e risque produtos em segundos, com uma mão só.",
    feat3_h3: "Design claro pra comprar melhor",
    feat3_p: "Tudo bem organizado, sem confusão nem passos a mais.",

    receipt_kicker: "Gasto, linha por linha",
    receipt_h2: "Tudo o que você está levando, linha por linha.",
    receipt_lede: "Você vê quanto já gastou antes de chegar ao caixa, como um recibo que se monta sozinho.",
    receipt_sub: "TÍQUETE · LISTA ATUAL",
    receipt_total: "Total",

    gallery_kicker: "Assim ela é, sem maquiagem",
    gallery_h2: "Capturas reais do app.",
    gallery_lede: "Três telas, três momentos da compra.",
    gal1_h3: "Sua lista",
    gal1_p: "Tudo o que você precisa, sempre à mão.",
    gal1_alt: "Captura real da lista de compras com produtos, quantidades e preços.",
    gal2_h3: "Adicione em segundos",
    gal2_p: "Nome, quantidade e preço. Só isso.",
    gal2_alt: "Captura real do formulário para adicionar um produto: nome, quantidade e preço.",
    gal3_h3: "Seus ícones",
    gal3_p: "Personalize sua lista do seu jeito.",
    gal3_alt: "Captura real do seletor de ícones de produto.",

    gondola_slot: "Mais ferramentas, em breve",
    gondola_h2: "Neko Lista é a primeira. Não a única.",
    gondola_p: "Estamos criando ferramentas simples para a vida real, sob o mesmo teto: Neko Tools.",
    gondola_cta: "Conhecer a Neko Tools",
    box_aria: "Ver uma prévia das próximas ferramentas",
    box_closed_alt: "Uma caixa de papelão fechada com fita verde e um adesivo de gato: as próximas ferramentas da Neko Tools, a caminho.",

    final_h2: "Pronto pra uma compra mais simples?",
    final_p: "Neko Lista te acompanha, do carrinho ao total.",
    final_apoyar: "Apoiar",
    final_mascot_alt: "O gato da Neko Tools caminhando e sorrindo, com uma sacola de compras cheia de verduras, pão e leite.",

    about_kicker: "Quem somos",
    about_h2: "Um desenvolvedor, não uma empresa.",
    about_p1: "Eu crio e mantenho a Neko Tools sozinho. Faço coisas que eu mesmo preciso primeiro: o Neko Lista nasceu porque eu não encontrava uma lista de compras simples, sem conta e sem anúncios, que fizesse bem uma única coisa.",
    about_p2: "Se você encontrou um bug, sente falta de alguma função, ou só quer me contar o que achou do app, me escreva — eu leio todas as mensagens.",
    about_role: "Desenvolvedor da Neko Tools · Argentina",

    contact_h3: "Me mande uma mensagem",
    contact_lede: "Respondo por email, geralmente em um dia ou dois.",
    contact_label_name: "Nome",
    contact_label_email: "Seu email",
    contact_label_message: "Mensagem",
    contact_submit: "Enviar mensagem",
    contact_status_sending: "Enviando…",
    contact_status_ok: "Obrigado! Vou te responder por email.",
    contact_status_error: "Não foi possível enviar. Tente de novo ou fale comigo direto pelo Ko-fi.",

    footer_tagline: "Ferramentas simples para a vida real. Feito com 💚 na Argentina.",
  },

  tr: {
    nav_neko_lista: "Neko Lista",
    nav_proximamente: "Yakında",
    nav_sobre: "Hakkında",
    nav_abrir: "Neko Lista'yı Aç",
    theme_to_dark_aria: "Koyu moda geç",
    theme_to_light_aria: "Aydınlık moda geç",
    nav_toggle_open_aria: "Menüyü aç",
    nav_toggle_close_aria: "Menüyü kapat",
    lang_toggle_aria: "Dili değiştir",

    hero_kicker: "Neko Lista · alışveriş listesi",
    hero_h1: "Sayı saymayı bilen market listesi.",
    hero_lede: "Miktarlar, fiyatlar ve toplam tutar, eklediğin anda güncellenir. Hesap yok, reklam yok, uğraş yok.",
    tag_gratis: "Ücretsiz",
    tag_sin_cuenta: "Hesap gerektirmez",
    tag_instalable: "Yüklenebilir",
    hero_cta_ver_funciones: "Özellikleri gör",
    hero_cta_compartir: "Paylaş",
    share_text: "Neko Lista: toplamı anında hesaplayan alışveriş listesi.",
    share_toast_copied: "Bağlantı kopyalandı",
    share_copy_manual: "Paylaşmak için bu bağlantıyı kopyala:",
    float1_k: "Güncellenir",
    float1_v: "anında",
    float2_k: "Daha az düşün",
    float2_v: "kendine daha çok zaman kal",
    hero_screenshot_alt: "Neko Lista'dan gerçek bir ekran görüntüsü: Süt, Ekmek, Yumurta, Domates, Muz, Tavuk, Pirinç ve Tuvalet kağıdı olan alışveriş listesi, toplam $18.900.",

    features_kicker: "Neden farklı hissettiriyor",
    features_h2: "İnsanların açar açmaz fark ettiği üç detay.",
    features_lede: "Hiç sürtünme yok: aç, ekle, alışverişe git.",
    feat1_h3: "Toplamı anında hesaplar",
    feat1_p: "Hesap makinesine gerek kalmadan ne kadar harcadığını anında gör.",
    feat2_h3: "Basit ve hızlı liste",
    feat2_p: "Ürünleri saniyeler içinde, tek elinle ekle, düzenle ve işaretle.",
    feat3_h3: "Daha iyi alışveriş için sade tasarım",
    feat3_p: "Her şey düzenli, karmaşa ve gereksiz adım yok.",

    receipt_kicker: "Harcama, satır satır",
    receipt_h2: "Aldığın her şey, satır satır önünde.",
    receipt_lede: "Kasaya varmadan önce ne kadar harcadığını gör — kendi kendine yazılan bir fiş gibi.",
    receipt_sub: "FİŞ · GÜNCEL LİSTE",
    receipt_total: "Toplam",

    gallery_kicker: "İşte gerçek hali, rötuşsuz",
    gallery_h2: "Uygulamadan gerçek ekran görüntüleri.",
    gallery_lede: "Üç ekran, alışverişin üç anı.",
    gal1_h3: "Listen",
    gal1_p: "İhtiyacın olan her şey, her zaman elinin altında.",
    gal1_alt: "Ürünler, miktarlar ve fiyatlarla alışveriş listesinin gerçek ekran görüntüsü.",
    gal2_h3: "Saniyeler içinde ekle",
    gal2_p: "İsim, miktar ve fiyat. Başka bir şey yok.",
    gal2_alt: "Ürün ekleme formunun gerçek ekran görüntüsü: isim, miktar ve fiyat.",
    gal3_h3: "İkonların",
    gal3_p: "Listeni kendi tarzına göre kişiselleştir.",
    gal3_alt: "Ürün ikonu seçicisinin gerçek ekran görüntüsü.",

    gondola_slot: "Daha fazla araç, yakında",
    gondola_h2: "Neko Lista ilki. Tek olanı değil.",
    gondola_p: "Gerçek hayat için basit araçlar üretiyoruz, hepsi tek bir çatı altında: Neko Tools.",
    gondola_cta: "Neko Tools'u tanı",
    box_aria: "Yakında gelecek araçların önizlemesini gör",
    box_closed_alt: "Yeşil bantlı ve kedi çıkartmalı kapalı bir karton kutu: Neko Tools'un yaklaşan araçları yolda.",

    final_h2: "Daha basit bir alışverişe hazır mısın?",
    final_p: "Neko Lista sepetten kasaya kadar yanında.",
    final_apoyar: "Destek ol",
    final_mascot_alt: "Sebze, ekmek ve sütle dolu bir alışveriş çantası taşıyan, yürüyüp gülümseyen Neko Tools kedisi.",

    about_kicker: "Hakkımızda",
    about_h2: "Bir şirket değil, bir geliştirici.",
    about_p1: "Neko Tools'u tek başıma yapıyor ve sürdürüyorum. Önce kendi ihtiyacım olan şeyleri yapıyorum: Neko Lista, hesap ve reklam gerektirmeyen, tek bir işi iyi yapan basit bir alışveriş listesi bulamadığım için doğdu.",
    about_p2: "Bir hata bulduysan, eksik bir özellik varsa ya da uygulama hakkında ne düşündüğünü söylemek istiyorsan, yaz bana — her mesajı okuyorum.",
    about_role: "Neko Tools geliştiricisi · Arjantin",

    contact_h3: "Bana bir mesaj gönder",
    contact_lede: "Genellikle bir ya da iki gün içinde e-posta ile yanıt veriyorum.",
    contact_label_name: "İsim",
    contact_label_email: "E-postan",
    contact_label_message: "Mesaj",
    contact_submit: "Mesajı gönder",
    contact_status_sending: "Gönderiliyor…",
    contact_status_ok: "Teşekkürler! E-posta ile yanıt vereceğim.",
    contact_status_error: "Gönderilemedi. Tekrar dene ya da doğrudan Ko-fi üzerinden ulaş.",

    footer_tagline: "Gerçek hayat için basit araçlar. Arjantin'de 💚 ile yapıldı.",
  },

  ru: {
    nav_neko_lista: "Neko Lista",
    nav_proximamente: "Скоро",
    nav_sobre: "О нас",
    nav_abrir: "Открыть Neko Lista",
    theme_to_dark_aria: "Включить тёмную тему",
    theme_to_light_aria: "Включить светлую тему",
    nav_toggle_open_aria: "Открыть меню",
    nav_toggle_close_aria: "Закрыть меню",
    lang_toggle_aria: "Сменить язык",

    hero_kicker: "Neko Lista · список покупок",
    hero_h1: "Список покупок, который <em>умеет считать</em>.",
    hero_lede: "Количество, цены и общая сумма — обновляются сразу же. Без регистрации, без рекламы, без лишних хлопот.",
    tag_gratis: "Бесплатно",
    tag_sin_cuenta: "Без регистрации",
    tag_instalable: "Устанавливается",
    hero_cta_ver_funciones: "Смотреть функции",
    hero_cta_compartir: "Поделиться",
    share_text: "Neko Lista: список покупок, который сразу считает итоговую сумму.",
    share_toast_copied: "Ссылка скопирована",
    share_copy_manual: "Скопируйте эту ссылку, чтобы поделиться:",
    float1_k: "Обновляется",
    float1_v: "мгновенно",
    float2_k: "Меньше думать",
    float2_v: "больше времени для себя",
    hero_screenshot_alt: "Реальный скриншот Neko Lista: список покупок с молоком, хлебом, яйцами, помидорами, бананами, курицей, рисом и туалетной бумагой, итого $18 900.",

    features_kicker: "Почему это ощущается иначе",
    features_h2: "Три детали, которые люди замечают сразу же.",
    features_lede: "Никакого трения: открыл, добавил, пошёл за покупками.",
    feat1_h3: "Считает итог в реальном времени",
    feat1_p: "Видно, сколько уже потрачено, без калькулятора.",
    feat2_h3: "Простой и быстрый список",
    feat2_p: "Добавляй, редактируй и отмечай товары за секунды, одной рукой.",
    feat3_h3: "Понятный дизайн для удобных покупок",
    feat3_p: "Всё аккуратно организовано, без путаницы и лишних шагов.",

    receipt_kicker: "Расходы, строка за строкой",
    receipt_h2: "Всё, что вы берёте, строка за строкой.",
    receipt_lede: "Видно, сколько потрачено, ещё до кассы — как чек, который составляется сам.",
    receipt_sub: "ЧЕК · ТЕКУЩИЙ СПИСОК",
    receipt_total: "Итого",

    gallery_kicker: "Как это выглядит на самом деле",
    gallery_h2: "Реальные скриншоты приложения.",
    gallery_lede: "Три экрана, три момента похода за покупками.",
    gal1_h3: "Твой список",
    gal1_p: "Всё, что нужно, всегда под рукой.",
    gal1_alt: "Реальный скриншот списка покупок с товарами, количеством и ценами.",
    gal2_h3: "Добавляй за секунды",
    gal2_p: "Название, количество и цена. Больше ничего.",
    gal2_alt: "Реальный скриншот формы добавления товара: название, количество и цена.",
    gal3_h3: "Твои иконки",
    gal3_p: "Настрой список под себя.",
    gal3_alt: "Реальный скриншот выбора иконки товара.",

    gondola_slot: "Больше инструментов, скоро",
    gondola_h2: "Neko Lista — первый. Но не единственный.",
    gondola_p: "Мы создаём простые инструменты для реальной жизни, все под одной крышей: Neko Tools.",
    gondola_cta: "Узнать про Neko Tools",
    box_aria: "Посмотреть анонс будущих инструментов",
    box_closed_alt: "Закрытая картонная коробка с зелёной лентой и наклейкой кота: новые инструменты Neko Tools уже в пути.",

    final_h2: "Готовы к более простым покупкам?",
    final_p: "Neko Lista с вами от корзины до итога.",
    final_apoyar: "Поддержать",
    final_mascot_alt: "Кот Neko Tools идёт и улыбается, неся пакет с овощами, хлебом и молоком.",

    about_kicker: "Кто мы",
    about_h2: "Разработчик, а не компания.",
    about_p1: "Neko Tools я делаю и поддерживаю в одиночку. Сначала я создаю то, что нужно мне самому: Neko Lista появилась потому, что я не мог найти простой список покупок — без регистрации и рекламы, который хорошо делал бы одно дело.",
    about_p2: "Если нашли баг, не хватает функции, или просто хотите рассказать, что думаете о приложении — напишите мне, я читаю все сообщения.",
    about_role: "Разработчик Neko Tools · Аргентина",

    contact_h3: "Напишите мне",
    contact_lede: "Отвечаю по почте, обычно в течение одного-двух дней.",
    contact_label_name: "Имя",
    contact_label_email: "Ваш email",
    contact_label_message: "Сообщение",
    contact_submit: "Отправить сообщение",
    contact_status_sending: "Отправка…",
    contact_status_ok: "Спасибо! Отвечу вам по почте.",
    contact_status_error: "Не удалось отправить. Попробуйте ещё раз или напишите напрямую через Ko-fi.",

    footer_tagline: "Простые инструменты для реальной жизни. Сделано с 💚 в Аргентине.",
  },

  ja: {
    nav_neko_lista: "Neko Lista",
    nav_proximamente: "今後の予定",
    nav_sobre: "概要",
    nav_abrir: "Neko Listaを開く",
    theme_to_dark_aria: "ダークモードに切り替え",
    theme_to_light_aria: "ライトモードに切り替え",
    nav_toggle_open_aria: "メニューを開く",
    nav_toggle_close_aria: "メニューを閉じる",
    lang_toggle_aria: "言語を変更",

    hero_kicker: "Neko Lista・買い物リスト",
    hero_h1: "計算できる買い物リスト。",
    hero_lede: "数量、価格、合計金額がその場で更新されます。アカウント登録も広告も、面倒な手間もいりません。",
    tag_gratis: "無料",
    tag_sin_cuenta: "アカウント不要",
    tag_instalable: "インストール可能",
    hero_cta_ver_funciones: "機能を見る",
    hero_cta_compartir: "共有",
    share_text: "Neko Lista：買い物の合計をその場で計算してくれるショッピングリスト。",
    share_toast_copied: "リンクをコピーしました",
    share_copy_manual: "共有するにはこのリンクをコピーしてください：",
    float1_k: "更新は",
    float1_v: "その場で",
    float2_k: "考える手間を減らして",
    float2_v: "自分の時間を増やそう",
    hero_screenshot_alt: "Neko Listaの実際のスクリーンショット:牛乳、パン、卵、トマト、バナナ、鶏肉、米、トイレットペーパーの買い物リスト、合計$18,900。",

    features_kicker: "他と違うと感じる理由",
    features_h2: "開いてすぐ気づく3つのポイント。",
    features_lede: "手間ゼロ:開いて、追加して、買い物へ。",
    feat1_h3: "合計をリアルタイムで計算",
    feat1_p: "電卓を使わずに、今いくら使ったかその場でわかります。",
    feat2_h3: "シンプルで素早いリスト",
    feat2_p: "片手で数秒のうちに商品を追加・編集・チェックできます。",
    feat3_h3: "買い物しやすい、見やすいデザイン",
    feat3_p: "すっきり整理されていて、余計な手順がありません。",

    receipt_kicker: "支出を1行ずつ",
    receipt_h2: "持っているものすべてを1行ずつ。",
    receipt_lede: "レジに着く前に、自動でできあがるレシートのように使った金額がわかります。",
    receipt_sub: "レシート・現在のリスト",
    receipt_total: "合計",

    gallery_kicker: "飾らない、そのままの姿",
    gallery_h2: "アプリの実際のスクリーンショット。",
    gallery_lede: "3つの画面、買い物の3つの場面。",
    gal1_h3: "あなたのリスト",
    gal1_p: "必要なものすべてが、いつでも手元に。",
    gal1_alt: "商品、数量、価格が並ぶ買い物リストの実際のスクリーンショット。",
    gal2_h3: "数秒で追加",
    gal2_p: "名前、数量、価格。それだけです。",
    gal2_alt: "商品追加フォームの実際のスクリーンショット:名前、数量、価格。",
    gal3_h3: "アイコン",
    gal3_p: "自分らしくリストをカスタマイズ。",
    gal3_alt: "商品アイコン選択画面の実際のスクリーンショット。",

    gondola_slot: "新しいツール、近日公開",
    gondola_h2: "Neko Listaは最初の一歩。これで終わりではありません。",
    gondola_p: "実生活のためのシンプルなツールを、Neko Toolsという1つのブランドのもとで作っています。",
    gondola_cta: "Neko Toolsについて知る",
    box_aria: "近日公開のツールをプレビューする",
    box_closed_alt: "緑のテープと猫のステッカーが付いた閉じた段ボール箱:Neko Toolsの次のツールが近日登場。",

    final_h2: "もっとシンプルな買い物を始めませんか?",
    final_p: "カートからお会計まで、Neko Listaが一緒です。",
    final_apoyar: "応援する",
    final_mascot_alt: "野菜、パン、牛乳でいっぱいの買い物袋を持って歩きながら笑うNeko Toolsの猫。",

    about_kicker: "私たちについて",
    about_h2: "企業ではなく、一人の開発者です。",
    about_p1: "Neko Toolsは私一人で作り、運営しています。まず自分自身が必要なものを作ります。Neko Listaが生まれたのは、アカウント登録も広告もなく、1つのことをきちんとこなすシンプルな買い物リストが見つからなかったからです。",
    about_p2: "バグを見つけた、欲しい機能がある、あるいはアプリの感想を伝えたいときは、ぜひメッセージをください。すべて目を通しています。",
    about_role: "Neko Tools開発者・アルゼンチン",

    contact_h3: "メッセージを送る",
    contact_lede: "通常1〜2日以内にメールで返信します。",
    contact_label_name: "お名前",
    contact_label_email: "メールアドレス",
    contact_label_message: "メッセージ",
    contact_submit: "メッセージを送信",
    contact_status_sending: "送信中…",
    contact_status_ok: "ありがとうございます!メールで返信します。",
    contact_status_error: "送信できませんでした。もう一度試すか、Ko-fi経由で直接連絡してください。",

    footer_tagline: "実生活のためのシンプルなツール。アルゼンチンで💚を込めて制作。",
  },
};

/* ==========================================================================
   Helpers
   ========================================================================== */

function getCurrentLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch (error) {
    /* localStorage no disponible */
  }
  const browserLang = (navigator.language || "es").slice(0, 2).toLowerCase();
  return TRANSLATIONS[browserLang] ? browserLang : "es";
}

let currentLang = getCurrentLang();

function t(key) {
  return (
    (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
    TRANSLATIONS.es[key] ||
    key
  );
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (error) {
    console.error("No se pudo guardar el idioma.", error);
  }
  applyStaticTranslations();
  document.dispatchEvent(new CustomEvent("nekoLangChanged", { detail: { lang: lang } }));
}

// Recorre el DOM y aplica las traducciones a todo lo marcado con
// data-i18n / data-i18n-html / data-i18n-alt / data-i18n-aria-label.
function applyStaticTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
}
