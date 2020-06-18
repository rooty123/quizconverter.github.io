function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

async function convert() {
	let link = document.getElementById("input").value;
	let response = await fetch('https://api.marquiz.ru/v1/Quizzes/' + link.substring(link.lastIndexOf('/') + 1));
	let from = await response.json();
	console.log(from);
	let to = {
		"jsonData": {
			"allow_skip_contacts": false,
			"ask_contacts": [
				[
					"name",
					true
				],
				[
					"phone",
					true
				],
				[
					"email",
					from.results.view === "email" ? "required" : false
				],
				[
					"whatsapp",
					false
				],
				[
					"telegram",
					false
				],
				[
					"viber",
					false
				],
				[
					"skype",
					false
				]
			],
			"ask_messengers": [
				[
					"whatsapp",
					false
				],
				[
					"telegram",
					false
				],
				[
					"viber",
					false
				],
				[
					"instagram",
					false
				],
				[
					"messenger",
					false
				],
				[
					"vkontakte",
					false
				]
			],
			"at_least_one_contact": false,
			"background_image": from.info.startPage.bg.url,
			"button_text": from.info.startPage.buttonText,
			"contacts_button_text": from.info.design.colors.buttonTextColor,
			"customStyles": "",
			"elements_color": from.info.design.colors.main === "" || from.info.design.colors.main === "#ffffff" ? "#79c5ff" : from.info.design.colors.main,
			"enable_messangers": false,
			"enable_quiz": true,
			"expert_image": from.info.assistant.avatar !== "" ? from.info.assistant.avatar.url : "",
			"expert_name": from.info.assistant.name,
			"expert_position": from.info.assistant.title,
			"initial_state": "cover",
			"language": "ru",
			"major_color": from.info.design.colors.main,
			"metrica_id": "",
			"phone_prefix": "+7",
			"placement_type": "float",
			"privacy_policy_text": "Введенные данные обрабатываются в соответствии с политикой строгой конфиденциальности",
			"questions": [],
			"quiz_description": from.info.startPage.subtitle,
			"quiz_sys_name": from.info.startPage.title,
			"quiz_title": from.info.startPage.title,
			"request_contacts": true,
			"request_contacts_button": "Последний шаг",
			"request_contacts_title": "Оставьте ваши контакты",
			"results": [],
			"results_before_contacts": false,
			"results_formula": "",
			"results_type": "fixed",
			"show_expert": from.info.assistant.name !== "",
			"show_results": from.results.items !== undefined ? from.results.items.length > 0 : false,
			"side_image": "",
			"text_color": from.info.design.colors.buttonTextColor
		},
		"notifications": {}
	};
	if (from.results.items !== undefined) {
		for (let i = 0; i < from.results.items.length; i++) {
			to.jsonData.results.push({
				"result_image": from.results.items[i].image !== undefined ? from.results.items[i].image.url : "",
				"result_title": from.results.items[i].title,
				"result_description": from.results.items[i].text,
				"result_kind": "text",
			})
		}
	}

	for (let i = 0; i < from.questions.length; i++) {
		if (from.questions[i].type === "variants") {
			to.jsonData.questions.push({
				"allow_multiple": from.questions[i].select === "many",
				"answers": [],
				"image_placement": true,
				"question_kind": "option",
				"question_options_list": true,
				"question_title": from.questions[i].title
			});
			for (let a = 0; a < from.questions[i].answers.length; a++) {
				to.jsonData.questions[to.jsonData.questions.length - 1].answers.push({
					"answer_title": from.questions[i].answers[a].title,
					"skip_to": "next"
				})
			}
		} else if (from.questions[i].type === "slider") {
			to.jsonData.questions.push({
				"answers": [
					{
						"max_value": from.questions[i].options.range.max,
						"min_value": from.questions[i].options.range.min,
						"required": true,
						"image_placement": true,
						"skip_to": "next",
						"ui_input": true
					}
				],
				"question_kind": "numeric",
				"question_title": from.questions[i].title
			});
		} else if (from.questions[i].type === "input") {
			to.jsonData.questions.push({
				"answers": [
					{
						"required": false,
						"skip_to": "next",
						"image_placement": true,
						"textarea": true
					}
				],
				"question_kind": "text",
				"question_title": from.questions[i].title
			});
		} else if (from.questions[i].type === "images") {
			to.jsonData.questions.push({
				"allow_multiple": from.questions[i].select === "many",
				"answers": [],
				"image_placement": "option-image",
				"question_kind": "option_image",
				"question_title": from.questions[i].title
			});
			for (let a = 0; a < from.questions[i].answers.length; a++) {
				to.jsonData.questions[to.jsonData.questions.length - 1].answers.push({
					"answer_image": from.questions[i].answers[a].image.url,
					"answer_title": from.questions[i].answers[a].title,
					"skip_to": "next"
				})
			}
		} else if (from.questions[i].type === "date") {
			to.jsonData.questions.push({
				"answers": [
					{
						"required": false,
						"skip_to": "next",
						"image_placement": true,
						"textarea": true
					}
				],
				"question_kind": "text",
				"question_title": from.questions[i].title
			});
		} else if (from.questions[i].type === "file") {
			to.jsonData.questions.push({
				"answers": [
					{
						"required": false,
						"skip_to": "next"
					}
				],
				"question_kind": "file",
				"question_title": from.questions[i].title
			});
		} else if (from.questions[i].type === "select") {
			to.jsonData.questions.push({
				"allow_multiple": false,
				"answers": [],
				"image_placement": true,
				"question_kind": "option",
				"question_options_list": true,
				"question_title": from.questions[i].title
			});
			for (let a = 0; a < from.questions[i].answers.length; a++) {
				to.jsonData.questions[to.jsonData.questions.length - 1].answers.push({
					"answer_title": from.questions[i].answers[a].title,
					"skip_to": "next"
				})
			}
		}
	}
	//document.getElementById("output").innerHTML = JSON.stringify(to);
	download("result.json", JSON.stringify(to));
}