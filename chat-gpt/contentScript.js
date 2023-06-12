(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type } = obj;
        if (type === "Start") {
            addButtons();
            addStyle();
            changeFileButtonsPlace();
        }
    });

    addStyle();
    addButtons();

    function addStyle() {
        const styleExists = document.getElementById('customStyle')
        if (!styleExists) {
            let style = document.createElement("style");
            style.id = "customStyle";
            // make it fixed in bottom right corner
            style.innerHTML = `
                .dir-buttons {
                    position: fixed;
                    bottom: 250px;
                    right: 45px;
                    z-index: 999;
                }
                .file-buttons{
                    position: fixed;
                    bottom: 200px;
                    right: 45px;
                    z-index: 999;
                }
                .dir-buttons img{
                    cursor: pointer;
                    margin: 15px 0 ;
                }
                `;

            document.head.appendChild(style);
        }
    }

    function addButtons() {
        const dirBtnExists = document.getElementsByClassName("dir-buttons")[0];
        const attributes = {
            width: "45",
            height: "45",
        }
        if (!dirBtnExists) {
            const buttons = [
                {
                    htmlType: "img",
                    attributes: {
                        ...attributes,
                        src: chrome.runtime.getURL("assets/arrow.png"),
                    },
                    onclick: changeDir,
                    type: "action"
                },
                {
                    htmlType: "img",
                    attributes: {
                        ...attributes,
                        src: chrome.runtime.getURL("assets/arabic.png"),
                    },
                    type: "text",
                    text: "ترجم بالغة العربية المصرية العامية من فضلك وبلغة واضحة"
                },
                {
                    htmlType: "img",
                    attributes: {
                        ...attributes,
                        src: chrome.runtime.getURL("assets/js.png"),
                    },
                    type: "text",
                    text: "أريدك أن تعمل كوحدة تحكم جافا سكريبت. سأكتب الأوامر وسوف ترد بما يجب أن تعرضه وحدة تحكم جافا سكريبت. أريدك أن ترد فقط مع الإخراج الطرفي داخل كتلة رمز فريدة واحدة ، ولا شيء آخر. لا تكتب تفسيرات. لا تكتب الأوامر إلا إذا أوصيك بذلك. عندما أحتاج إلى إخبارك بشيء ما باللغة الإنجليزية ، سأفعل ذلك عن طريق وضع نص داخل أقواس معقوفة {مثل هذا}. أمري الأول هو"
                },
                {
                    htmlType: "img",
                    attributes: {
                        ...attributes,
                        src: chrome.runtime.getURL("assets/draw.png"),
                    },
                    type: "text",
                    text:
                        `1- مثل انك مدرس محترف 
                         2- اشرح خطوة بخطوة بالرسم باستخدام الرموز مثل - ,_ ,| ,/ ,\ ,* ,+ ,= ,# ,@ ,^ ,~ ,< ,> ,& ,% ,! ,? ,: ,; ,. الي اخره الشرح
                         3- لا تحاول الرد بأي شيء غير الرسم الا اذا اوصيتك بذلك
                         4- لا تحاول ان تتخطي الخطوات او تختصرها او تغيرها او تضيف عليها اي شيء
                         5- تذكر انك مدرس محترف وانك تشرح لطالب محترف
                         6- لا تتخطي  العمليات الدقيقة  واشرها ايضا بالرسم
                         7- تذكر انك لا تستطيع ان تتحدث مع الطالب وانما تشرح له بالرسم فقط`
                },
                {
                    htmlType: "img",
                    attributes: {
                        ...attributes,
                        src: chrome.runtime.getURL("assets/programmer.png"),
                    },
                    type: "text",
                    text:
                        `1: انت مدرس محترف وانا طالب محترف + انت ذكي جدا وتستطيع ان تشرح لي اي شيء
                         2- قم بشرح الموضوع التالي بالتفاصيل بشكل موجز ومختصر
                         3- لا تنسي اي خطوة ولا تتخطيها حتي لو كانت بسيطة
                         4- لا تحاول ان تتخطي الخطوات او تختصرها او تغيرها او تضيف عليها اي شيء
                         5- يمكنك استخدام الرموز التالية للرسم - ,_ ,| ,/ ,\ ,* ,+ ,= ,# ,@ ,^ ,~ ,< ,> ,& ,% ,! ,? ,: ,; ,.
                         6- استخدم الجداول والرسومات التوضيحية اذا احتجت لذلك او اوصيتك بذلك
                        =>`
                },
            ];
            let dirBtn = document.createElement('div');
            dirBtn.className = "dir-buttons";

            // loop over buttons
            buttons
                .reverse()
                .forEach((btn) => {
                    let btn1 = document.createElement(btn.htmlType);
                    // loop over attributes
                    for (let attr in btn.attributes) {
                        btn1.setAttribute(attr, btn.attributes[attr]);
                    }
                    if (btn.type === "text") {
                        btn1.onclick = () => {
                            textConverter(btn.text);
                        }
                    } else if (btn.type === "action") {
                        btn1.onclick = () => {
                            btn.onclick();
                        }
                    }

                    dirBtn.appendChild(btn1);
                });

            // append buttons to body
            document.body.appendChild(dirBtn);
        }

    }

    function changeDir() {
        let dirStyleEl = document.getElementById("dir-style");
        if (dirStyleEl) {
            dirStyleEl.remove();
        } else {
            let dirStyle = document.createElement("style");
            dirStyle.id = "dir-style";

            const markdownEl = document.getElementsByClassName("markdown")[0];
            // get dir style of markdown
            const dirStyleOfMarkdown = window.getComputedStyle(markdownEl).getPropertyValue("direction");
            if (dirStyleOfMarkdown) {
                dirStyle.innerHTML = `
                    .markdown {direction: ${dirStyleOfMarkdown === "rtl" ? "ltr" : "rtl"};}
                    pre {direction: ltr; text-align: left;}
                `;

                document.head.appendChild(dirStyle);
            }
        }
    }

    textConverter = (text) => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            // Get the old value of the textarea
            const oldValue = textarea.value;

            const newText = ` ${text} { ${oldValue} }`;

            // Update the value of the textarea with the translated text and explanation
            textarea.value = newText;
        }

        const sendButton = document.querySelectorAll('form button')[1];

        if (sendButton) {
            sendButton.click();
        }
    }

    function changeFileButtonsPlace() {
        const fileButtons = buttons = document.getElementsByClassName('stretch ')[0].nextElementSibling;
        if (fileButtons) {
            // add class file-buttons to file buttons
            fileButtons.className = "file-buttons";
            // remove all children of file buttons except the first one
            while (fileButtons.children.length > 1) {
                fileButtons.removeChild(fileButtons.lastChild);
            }

            // remove style attribute from  file buttons
            fileButtons.removeAttribute("style");
            // remove style attribute from  file buttons first child
            fileButtons.firstElementChild.removeAttribute("style");
            // remove inner html from  first child of file buttons
            fileButtons.firstElementChild.innerHTML = "";
            // add img to first child of file buttons
            const img = document.createElement("img");
            img.src = chrome.runtime.getURL("assets/upload.png");
            img.className = "file-btn";
            img.width = "45";
            img.height = "45";
            fileButtons.firstElementChild.appendChild(img);
        }

    };
})();
