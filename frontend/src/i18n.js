import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ru: {
        translation: {
          nav: {
            home: 'Главная',
            profile: 'Профиль',
            logout: 'Выйти',
            login: 'Войти'
          },
          home: {
            badge: 'Ваша история достойна вечности',
            title: 'Legacy',
            subtitle: 'Сохраните самые ценные воспоминания в формате интерактивной книги. Ваша история — лучший подарок для будущих поколений.',
            cta: 'Начать писать книгу',
            featuresTitle: 'Возможности платформы',
            feat1Title: '200 Вопросов жизни',
            feat1Text: 'Специально подобранные вопросы, которые помогут вспомнить даже самые мелкие детали вашего пути.',
            feat2Title: 'ИИ-Редактор',
            feat2Text: 'Искусственный интеллект превратит ваши краткие ответы в художественное и связное повествование.',
            feat3Title: 'Интерактивная книга',
            feat3Text: 'Читайте свою историю в красивом 3D-формате, который напоминает настоящую бумажную книгу.',
            feat5Title: 'Мультиязычность',
            feat5Text: 'Пишите и читайте на русском, казахском или английском языках — как вам удобнее.',
            feat6Title: 'Безопасность',
            feat6Text: 'Ваши данные надежно защищены и доступны только вам и тем, кому вы решите их показать.',
            creatorTitle: 'Об Авторе Проекта',
            creatorText: 'Меня зовут Серикбаева Айша. Я студентка 3-го курса колледжа. Этот проект я создала на основе личной мотивации — мне очень хотелось посвятить книгу маме и младшему брату, чтобы сохранить нашу семейную историю. Так родился «Наследие» — место для ваших самых ценных слов.',
            howItWorksTitle: 'Как это работает?',
            step1Title: 'Ответьте на вопросы',
            step1Text: 'Простые наводящие вопросы о вашей жизни.',
            step2Title: 'ИИ-редактура',
            step2Text: 'Превращаем наброски в красивый текст.',
            step3Title: 'Добавьте детали',
            step3Text: 'Прикрепите фото и напишите предисловие.',
            step4Title: 'Готовая книга',
            step4Text: 'Читайте в 3D или отправляйте на печать.',
            aiDemoTitle: 'Магия ИИ-редактора',
            aiDemoBefore: 'До: "В детстве любил лето в деревне с дедом."',
            aiDemoAfter: 'После: "Теплые летние дни в деревне, проведенные вместе с дедушкой, навсегда остались в моей памяти как самое беззаботное и счастливое время..."',
            testimonialText: '«Я всегда хотел записать историю своего отца, но не знал, с чего начать. Этот сервис сделал всё за меня...»',
            testimonialAuthor: '— Арман, пользователь',
            finalCtaTitle: 'История вашей семьи заслуживает быть рассказанной',
            finalCtaBtn: 'Начать первую главу'
          },
          profile: {
            title: 'Моя Библиотека',
            inProgress: 'В процессе',
            completed: 'Готовые шедевры',
            newBook: 'Новый том',
            draft: 'Черновик',
            ready: 'Завершено',
            deleteConfirm: 'Удалить эту книгу?',
            loading: 'Загрузка...'
          },
          questions: {
            back: 'На полку',
            finish: 'Готово! Отправить на редакцию',
            save: 'Сохранить',
            cancel: 'Отмена',
            titleEmpty: 'Название не может быть пустым',
            errorSave: 'Ошибка при сохранении изменений',
            atLeastOne: 'Сначала ответьте хотя бы на один вопрос.',
            success: 'ИИ завершил редактуру! Книга готова.',
            errorServer: 'Ошибка сервера: ',
            errorNetwork: 'Сетевая ошибка: ',
            aiTitle: 'ИИ анализирует вашу книгу...',
            aiText: 'Мы исправляем ошибки, связываем мысли и создаем плавное повествование. Это займет около минуты.',
            searchPlaceholder: 'Поиск по вопросам вашей истории...',
            pending: 'Нужно ответить',
            finished: 'Готовые ответы',
            prefaceEmpty: 'Добавьте предисловие, чтобы сделать вашу книгу особенной...'
          },
          editor: {
            back: 'К списку вопросов',
            placeholder: 'Начните писать здесь...',
            aiFix: 'Улучшить через ИИ',
            photo: 'Фото',
            save: 'Сохранить',
            saved: 'Сохранено',
            errorSave: 'Не удалось сохранить ответ.',
            errorUpload: 'Не удалось загрузить фото.',
            pleaseLogin: 'Пожалуйста, войдите в систему.',
            notFound: 'Вопрос не найден'
          },
          reader: {
            loading: 'Открываем книгу...',
            back: 'К редактированию',
            hint: 'Нажмите на край страницы, чтобы листать',
            memoirs: 'Мемуары',
            preface: 'Предисловие',
            end: 'Конец первой главы',
            continue: 'История продолжается...'
          }
        }
      },
      kk: {
        translation: {
          nav: {
            home: 'Басты бет',
            profile: 'Профиль',
            logout: 'Шығу',
            login: 'Кіру'
          },
          home: {
            badge: 'Сіздің тарихыңыз мәңгілікке лайықты',
            title: 'Наследие',
            subtitle: 'Ең құнды естеліктеріңізді интерактивті кітап форматында сақтаңыз. Сіздің тарихыңыз — болашақ ұрпақ үшін ең жақсы сыйлық.',
            cta: 'Өз кітабыңды жаз',
            featuresTitle: 'Платформа мүмкіндіктері',
            feat1Title: '200 Өмірлік сұрақ',
            feat1Text: 'Сіздің жолыңыздың ең ұсақ бөлшектерін еске түсіруге көмектесетін арнайы таңдалған сұрақтар.',
            feat2Title: 'ЖИ-Редактор',
            feat2Text: 'Жасанды интеллект сіздің қысқа жауаптарыңызды көркем және жүйелі хикаяға айналдырады.',
            feat3Title: 'Интерактивті кітап',
            feat3Text: 'Өз тарихыңызды нағыз қағаз кітапқа ұқсайтын әдемі 3D-форматта оқыңыз.',
            feat5Title: 'Мультітілділік',
            feat5Text: 'Орыс, қазақ немесе ағылшын тілдерінде жазыңыз және оқыңыз — қайсысы сізге ыңғайлы.',
            feat6Title: 'Қауіпсіздік',
            feat6Text: 'Сіздің деректеріңіз сенімді қорғалған және тек сізге және сіз көрсеткіңіз келетін адамдарға ғана қолжетімді.',
            creatorTitle: 'Жоба авторы туралы',
            creatorText: 'Менің есімім Серікбаева Айша. Мен колледждің үшінші курс студентімін. Мен бұл жобаны жеке мақсатпен жасадым — анам мен ініме арнап кітап жазып, отбасылық тарихымызды сақтағым келді. Осылайша «Наследие» — сіздің ең құнды сөздеріңізге арналған орын пайда болды.',
            howItWorksTitle: 'Бұл қалай жұмыс істейді?',
            step1Title: 'Сұрақтарға жауап беріңіз',
            step1Text: 'Өміріңіз туралы қарапайым жетелеуші сұрақтар.',
            step2Title: 'ЖИ-редакциялау',
            step2Text: 'Жазбаларыңызды көркем мәтінге айналдырамыз.',
            step3Title: 'Бөлшектер қосыңыз',
            step3Text: 'Фотосуреттер тіркеп, алғысөз жазыңыз.',
            step4Title: 'Дайын кітап',
            step4Text: '3D форматында оқыңыз немесе баспаға беріңіз.',
            aiDemoTitle: 'ЖИ-редактордың сиқыры',
            aiDemoBefore: 'Дейін: "Бала кезде атаммен ауылдағы жазды жақсы көретінмін."',
            aiDemoAfter: 'Кейін: "Атаммен бірге ауылда өткізген жылы жаз күндері менің есімде ең қамсыз және бақытты шақ ретінде мәңгі сақталып қалды..."',
            testimonialText: '«Мен әрқашан әкемнің тарихын жазғым келді, бірақ неден бастауды білмедім. Бұл сервис бәрін мен үшін жасады...»',
            testimonialAuthor: '— Арман, пайдаланушы',
            finalCtaTitle: 'Сіздің отбасыңыздың тарихы айтылуға лайық',
            finalCtaBtn: 'Бірінші тарауды бастау'
          },
          profile: {
            title: 'Менің Кітапханам',
            inProgress: 'Жазылу үстінде',
            completed: 'Дайын туындылар',
            newBook: 'Жаңа том',
            draft: 'Шимай',
            ready: 'Аяқталды',
            deleteConfirm: 'Бұл кітапты жою керек пе?',
            loading: 'Жүктелуде...'
          },
          questions: {
            back: 'Сөреге оралу',
            finish: 'Дайын! Редакциялауға жіберу',
            save: 'Сақтау',
            cancel: 'Бас тарту',
            titleEmpty: 'Атауы бос болмауы керек',
            errorSave: 'Өзгерістерді сақтау кезінде қате кетті',
            atLeastOne: 'Алдымен кем дегенде бір сұраққа жауап беріңіз.',
            success: 'ЖИ редакциялауды аяқтады! Кітап дайын.',
            errorServer: 'Сервер қатесі: ',
            errorNetwork: 'Желілік қате: ',
            aiTitle: 'ЖИ сіздің кітабыңызды талдауда...',
            aiText: 'Біз қателерді түзеп, ойларды байланыстырып, жүйелі мәтін жасаудамыз. Бұл шамамен бір минут алады.',
            searchPlaceholder: 'Өз тарихыңыздың сұрақтары бойынша іздеу...',
            pending: 'Жауап беру керек',
            finished: 'Дайын жауаптар',
            prefaceEmpty: 'Кітабыңызды ерекше ету үшін алғысөз қосыңыз...'
          },
          editor: {
            back: 'Сұрақтар тізіміне',
            placeholder: 'Осында жаза бастаңыз...',
            aiFix: 'ЖИ арқылы жақсарту',
            photo: 'Фото',
            save: 'Сақтау',
            saved: 'Сақталды',
            errorSave: 'Жауапты сақтау мүмкін болмады.',
            errorUpload: 'Суретті жүктеу мүмкін болмады.',
            pleaseLogin: 'Жүйеге кіріңіз.',
            notFound: 'Сұрақ табылмады'
          },
          reader: {
            loading: 'Кітапты ашудамыз...',
            back: 'Редакциялауға',
            hint: 'Парақтарды айналдыру үшін жиегін басыңыз',
            memoirs: 'Мемуарлар',
            preface: 'Алғысөз',
            end: 'Бірінші тараудың соңы',
            continue: 'Тарих жалғасуда...'
          }
        }
      },
      en: {
        translation: {
          nav: {
            home: 'Home',
            profile: 'Profile',
            logout: 'Logout',
            login: 'Login'
          },
          home: {
            badge: 'Your story deserves eternity',
            title: 'Legacy',
            subtitle: 'Preserve your most precious memories in an interactive book format. Your story is the best gift for future generations.',
            cta: 'Write your book',
            featuresTitle: 'Platform Features',
            feat1Title: '200 Life Questions',
            feat1Text: 'Carefully curated questions to help you remember even the smallest details of your journey.',
            feat2Title: 'AI Editor',
            feat2Text: 'Artificial intelligence turns your brief answers into a beautiful and coherent narrative.',
            feat3Title: 'Interactive Book',
            feat3Text: 'Read your story in a stunning 3D format that feels like a real paper book.',
            feat5Title: 'Multi-language',
            feat5Text: 'Write and read in Russian, Kazakh, or English — whichever is more comfortable for you.',
            feat6Title: 'Security',
            feat6Text: 'Your data is securely protected and accessible only to you and those you choose to share it with.',
            creatorTitle: 'About the Creator',
            creatorText: 'My name is Aisha Serikbayeva. I am a third-year college student. I recreated this project out of personal motivation — I really wanted to dedicate a book to my mother and younger brother to preserve our family history. That’s how "Legacy" was born — a place for your most precious words.',
            howItWorksTitle: 'How it works?',
            step1Title: 'Answer Questions',
            step1Text: 'Simple guiding questions about your life.',
            step2Title: 'AI Editing',
            step2Text: 'We turn your drafts into beautiful text.',
            step3Title: 'Add Details',
            step3Text: 'Attach photos and write a preface.',
            step4Title: 'Finished Book',
            step4Text: 'Read in 3D or send to print.',
            aiDemoTitle: 'The Magic of AI Editor',
            aiDemoBefore: 'Before: "Loved summer in village with grandpa."',
            aiDemoAfter: 'After: "The warm summer days spent in the village with my grandfather will forever remain in my memory as the most carefree and happy time..."',
            testimonialText: '"I always wanted to write my father\'s story but didn\'t know where to start. This service did everything for me..."',
            testimonialAuthor: '— Arman, user',
            finalCtaTitle: 'Your family story deserves to be told',
            finalCtaBtn: 'Start the first chapter'
          },
          profile: {
            title: 'My Library',
            inProgress: 'In Progress',
            completed: 'Finished Masterpieces',
            newBook: 'New Volume',
            draft: 'Draft',
            ready: 'Completed',
            deleteConfirm: 'Delete this book?',
            loading: 'Loading...'
          },
          questions: {
            back: 'To Library',
            finish: 'Finish! Send to Editing',
            save: 'Save',
            cancel: 'Cancel',
            titleEmpty: 'Title cannot be empty',
            errorSave: 'Error saving changes',
            atLeastOne: 'Answer at least one question first.',
            success: 'AI has finished editing! Your book is ready.',
            errorServer: 'Server error: ',
            errorNetwork: 'Network error: ',
            aiTitle: 'AI is analyzing your book...',
            aiText: 'We are fixing errors, connecting thoughts, and creating a smooth narrative. This will take about a minute.',
            searchPlaceholder: 'Search through your story questions...',
            pending: 'To Answer',
            finished: 'Finished Answers',
            prefaceEmpty: 'Add a preface to make your book special...'
          },
          editor: {
            back: 'To Question List',
            placeholder: 'Start writing here...',
            aiFix: 'Improve with AI',
            photo: 'Photo',
            save: 'Save',
            saved: 'Saved',
            errorSave: 'Failed to save answer.',
            errorUpload: 'Failed to upload photo.',
            pleaseLogin: 'Please log in.',
            notFound: 'Question not found'
          },
          reader: {
            loading: 'Opening the book...',
            back: 'Back to Editing',
            hint: 'Click the edge of the page to flip',
            memoirs: 'Memoirs',
            preface: 'Preface',
            end: 'End of Chapter One',
            continue: 'To be continued...'
          }
        }
      }
    }
  });

export default i18n;
