(function () {
  var script = document.currentScript;

  if (!script) {
    var scripts = document.getElementsByTagName("script");
    script = scripts[scripts.length - 1];
  }

  if (!script) {
    return;
  }

  var formId = script.getAttribute("data-form-id");
  var apiBase = (script.src || "").replace(/\/widget\.js(?:\?.*)?$/, "");

  var host = document.createElement("div");
  var isInlineHost = false;

  if (formId) {
    host.setAttribute("data-formflow-widget", formId);
  }

  var shadowRoot = host.attachShadow({ mode: "open" });

  function mountHost(position) {
    if (position === "inline") {
      isInlineHost = true;
      script.parentNode.insertBefore(host, script);
      script.parentNode.removeChild(script);
    } else {
      document.body.appendChild(host);
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderFrame(innerHtml, options) {
    var themeColor = (options && options.themeColor) || "#8b5cf6";
    var fontFamily = (options && options.fontFamily) || "Inter, Arial, sans-serif";
    var inlineMode = options && options.inlineMode;

    shadowRoot.innerHTML =
      '<style>' +
      ':host{all:initial}' +
      '.ff-root{font-family:' +
      fontFamily +
      ';color:#111827}' +
      '.ff-button{position:fixed;right:24px;bottom:24px;z-index:2147483647;background:' +
      themeColor +
      ';color:#fff;border:none;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 12px 35px rgba(0,0,0,.25);transition:transform .2s ease,box-shadow .2s ease}' +
      '.ff-button:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(0,0,0,.3)}' +
      '.ff-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(15,23,42,.55);display:flex;align-items:flex-end;justify-content:flex-end;padding:24px;opacity:0;pointer-events:none;transition:opacity .25s ease}' +
      '.ff-overlay.ff-open{opacity:1;pointer-events:auto}' +
      '.ff-card{width:100%;max-width:420px;max-height:calc(100vh - 48px);overflow:auto;background:#fff;border-radius:24px;box-shadow:0 24px 60px rgba(15,23,42,.32);transform:translateY(16px);opacity:0;transition:transform .25s ease,opacity .25s ease}' +
      '.ff-overlay.ff-open .ff-card{transform:translateY(0);opacity:1}' +
      '.ff-inline{display:block;width:100%;max-width:420px}' +
      '.ff-panel{padding:24px;background:#fff;border-radius:24px;border:1px solid rgba(148,163,184,.18);box-shadow:0 24px 60px rgba(15,23,42,.16)}' +
      '.ff-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:18px}' +
      '.ff-title{margin:0;font-size:24px;line-height:1.2;font-weight:700;color:#111827}' +
      '.ff-description{margin:8px 0 0;color:#6b7280;font-size:14px;line-height:1.55}' +
      '.ff-close{border:none;background:transparent;color:#64748b;font-size:22px;line-height:1;cursor:pointer;padding:2px 6px}' +
      '.ff-form{display:flex;flex-direction:column;gap:14px}' +
      '.ff-field{display:flex;flex-direction:column;gap:8px;opacity:0;transform:translateY(8px);animation:ffFadeUp .32s ease forwards}' +
      '.ff-label{font-size:14px;font-weight:600;color:#111827}' +
      '.ff-required{color:#ef4444}' +
      '.ff-input,.ff-select,.ff-textarea{width:100%;border:1px solid #dbe2ea;border-radius:14px;background:#fff;padding:12px 14px;font-size:14px;color:#111827;outline:none;transition:border-color .2s ease,box-shadow .2s ease}' +
      '.ff-input:focus,.ff-select:focus,.ff-textarea:focus{border-color:' +
      themeColor +
      ';box-shadow:0 0 0 3px rgba(139,92,246,.12)}' +
      '.ff-textarea{min-height:110px;resize:vertical}' +
      '.ff-options{display:flex;flex-direction:column;gap:8px}' +
      '.ff-option{display:flex;align-items:center;gap:10px;font-size:14px;color:#334155}' +
      '.ff-rating{display:flex;gap:8px}' +
      '.ff-star{border:none;background:transparent;padding:0;font-size:28px;line-height:1;cursor:pointer;color:#cbd5e1;transition:transform .15s ease,color .15s ease}' +
      '.ff-star.ff-active{color:' +
      themeColor +
      '}' +
      '.ff-star:hover{transform:scale(1.06)}' +
      '.ff-nps{display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:8px}' +
      '.ff-nps-btn{border:1px solid #dbe2ea;background:#fff;color:#334155;border-radius:12px;padding:10px 0;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s ease}' +
      '.ff-nps-btn.ff-active{background:' +
      themeColor +
      ';border-color:' +
      themeColor +
      ';color:#fff}' +
      '.ff-submit{border:none;border-radius:14px;background:' +
      themeColor +
      ';color:#fff;padding:13px 16px;font-size:14px;font-weight:700;cursor:pointer;transition:transform .15s ease,opacity .2s ease}' +
      '.ff-submit:active{transform:scale(.98)}' +
      '.ff-submit[disabled]{opacity:.7;cursor:not-allowed}' +
      '.ff-message{padding:18px;border-radius:16px;background:#f8fafc;color:#334155;font-size:14px;line-height:1.6}' +
      '.ff-error{color:#dc2626;font-size:13px;display:none}' +
      '.ff-error.ff-show{display:block}' +
      '.ff-success{padding:28px 24px;border-radius:18px;background:linear-gradient(180deg, rgba(139,92,246,.10), rgba(255,255,255,1));color:#111827;text-align:center;animation:ffFade .35s ease}' +
      '.ff-hidden{display:none}' +
      '@keyframes ffFadeUp{to{opacity:1;transform:translateY(0)}}' +
      '@keyframes ffFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
      '@media (max-width:640px){.ff-button{right:16px;bottom:16px}.ff-overlay{padding:16px}.ff-card{max-width:none}}' +
      "</style>" +
      '<div class="ff-root">' +
      (inlineMode ? '<div class="ff-inline">' + innerHtml + "</div>" : innerHtml) +
      "</div>";
  }

  function renderMessage(message, options) {
    renderFrame(
      '<div class="ff-panel"><div class="ff-message">' + escapeHtml(message) + "</div></div>",
      options
    );
  }

  function buildFieldHtml(field, index) {
    var label = '<label class="ff-label" for="ff_' + escapeHtml(field.id) + '">' + escapeHtml(field.label);
    if (field.required) {
      label += ' <span class="ff-required">*</span>';
    }
    label += "</label>";

    var fieldHtml = "";

    if (field.type === "text") {
      fieldHtml =
        label +
        '<input class="ff-input" id="ff_' +
        escapeHtml(field.id) +
        '" name="' +
        escapeHtml(field.id) +
        '" placeholder="' +
        escapeHtml(field.placeholder || "") +
        '" />';
    } else if (field.type === "feedback") {
      fieldHtml =
        label +
        '<textarea class="ff-textarea" id="ff_' +
        escapeHtml(field.id) +
        '" name="' +
        escapeHtml(field.id) +
        '" placeholder="' +
        escapeHtml(field.placeholder || "") +
        '"></textarea>';
    } else if (field.type === "dropdown") {
      var options = ['<option value="">Select an option</option>'];
      for (var i = 0; i < (field.options || []).length; i += 1) {
        options.push(
          '<option value="' +
            escapeHtml(field.options[i]) +
            '">' +
            escapeHtml(field.options[i]) +
            "</option>"
        );
      }
      fieldHtml =
        label +
        '<select class="ff-select" id="ff_' +
        escapeHtml(field.id) +
        '" name="' +
        escapeHtml(field.id) +
        '">' +
        options.join("") +
        "</select>";
    } else if (field.type === "checkbox") {
      var checkboxes = ['<div class="ff-options">'];
      for (var j = 0; j < (field.options || []).length; j += 1) {
        var option = field.options[j];
        checkboxes.push(
          '<label class="ff-option"><input type="checkbox" value="' +
            escapeHtml(option) +
            '" data-checkbox-group="' +
            escapeHtml(field.id) +
            '" />' +
            "<span>" +
            escapeHtml(option) +
            "</span></label>"
        );
      }
      checkboxes.push("</div>");
      fieldHtml = label + checkboxes.join("");
    } else if (field.type === "rating") {
      var stars = ['<div class="ff-rating" data-rating-group="' + escapeHtml(field.id) + '">'];
      for (var star = 1; star <= 5; star += 1) {
        stars.push(
          '<button type="button" class="ff-star" data-value="' +
            star +
            '" aria-label="Rate ' +
            star +
            ' out of 5">★</button>'
        );
      }
      stars.push(
        '<input type="hidden" name="' + escapeHtml(field.id) + '" value="" /></div>'
      );
      fieldHtml = label + stars.join("");
    } else if (field.type === "nps") {
      var nps = ['<div class="ff-nps" data-nps-group="' + escapeHtml(field.id) + '">'];
      for (var score = 0; score <= 10; score += 1) {
        nps.push(
          '<button type="button" class="ff-nps-btn" data-value="' +
            score +
            '">' +
            score +
            "</button>"
        );
      }
      nps.push(
        '<input type="hidden" name="' + escapeHtml(field.id) + '" value="" /></div>'
      );
      fieldHtml = label + nps.join("");
    }

    return (
      '<div class="ff-field" data-field-id="' +
      escapeHtml(field.id) +
      '" style="animation-delay:' +
      index * 0.04 +
      's">' +
      fieldHtml +
      "</div>"
    );
  }

  function collectResponses(formConfig) {
    var responses = {};

    for (var i = 0; i < formConfig.fields.length; i += 1) {
      var field = formConfig.fields[i];

      if (field.type === "checkbox") {
        var boxes = shadowRoot.querySelectorAll('[data-checkbox-group="' + field.id + '"]');
        var values = [];
        for (var b = 0; b < boxes.length; b += 1) {
          if (boxes[b].checked) {
            values.push(boxes[b].value);
          }
        }
        responses[field.id] = values;
      } else {
        var input = shadowRoot.querySelector('[name="' + field.id + '"]');
        responses[field.id] = input ? input.value : "";
      }
    }

    return responses;
  }

  function validateResponses(formConfig, responses) {
    for (var i = 0; i < formConfig.fields.length; i += 1) {
      var field = formConfig.fields[i];
      var value = responses[field.id];
      var missing =
        field.type === "checkbox"
          ? !value || !value.length
          : value === undefined || value === null || value === "";

      if (field.required && missing) {
        return field.label + " is required";
      }
    }

    return "";
  }

  function attachInteractiveHandlers(formConfig, options) {
    var overlay = shadowRoot.querySelector(".ff-overlay");
    var openButton = shadowRoot.querySelector(".ff-button");
    var closeButton = shadowRoot.querySelector(".ff-close");
    var widgetForm = shadowRoot.querySelector(".ff-form");
    var errorNode = shadowRoot.querySelector(".ff-error");
    var submitButton = shadowRoot.querySelector(".ff-submit");

    if (openButton && overlay) {
      openButton.addEventListener("click", function () {
        overlay.classList.add("ff-open");
      });
    }

    if (closeButton && overlay) {
      closeButton.addEventListener("click", function () {
        overlay.classList.remove("ff-open");
      });
    }

    if (overlay) {
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          overlay.classList.remove("ff-open");
        }
      });
    }

    var ratingGroups = shadowRoot.querySelectorAll("[data-rating-group]");
    for (var i = 0; i < ratingGroups.length; i += 1) {
      (function (group) {
        var hiddenInput = group.querySelector('input[type="hidden"]');
        var stars = group.querySelectorAll(".ff-star");

        function paintStars(value) {
          for (var s = 0; s < stars.length; s += 1) {
            var isActive = Number(stars[s].getAttribute("data-value")) <= value;
            if (isActive) {
              stars[s].classList.add("ff-active");
            } else {
              stars[s].classList.remove("ff-active");
            }
          }
        }

        for (var s = 0; s < stars.length; s += 1) {
          stars[s].addEventListener("click", function () {
            var value = Number(this.getAttribute("data-value"));
            hiddenInput.value = value;
            paintStars(value);
          });
        }
      })(ratingGroups[i]);
    }

    var npsGroups = shadowRoot.querySelectorAll("[data-nps-group]");
    for (var n = 0; n < npsGroups.length; n += 1) {
      (function (group) {
        var hiddenInput = group.querySelector('input[type="hidden"]');
        var buttons = group.querySelectorAll(".ff-nps-btn");

        function paintButtons(value) {
          for (var b = 0; b < buttons.length; b += 1) {
            if (Number(buttons[b].getAttribute("data-value")) === value) {
              buttons[b].classList.add("ff-active");
            } else {
              buttons[b].classList.remove("ff-active");
            }
          }
        }

        for (var b = 0; b < buttons.length; b += 1) {
          buttons[b].addEventListener("click", function () {
            var value = Number(this.getAttribute("data-value"));
            hiddenInput.value = value;
            paintButtons(value);
          });
        }
      })(npsGroups[n]);
    }

    if (!widgetForm) {
      return;
    }

    widgetForm.addEventListener("submit", function (event) {
      event.preventDefault();
      errorNode.classList.remove("ff-show");
      errorNode.textContent = "";

      var responses = collectResponses(formConfig);
      var validationError = validateResponses(formConfig, responses);

      if (validationError) {
        errorNode.textContent = validationError;
        errorNode.classList.add("ff-show");
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      fetch(apiBase + "/api/public/forms/" + formId + "/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses: responses }),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok) {
              throw new Error(data.message || "Failed to submit form");
            }
            return data;
          });
        })
        .then(function () {
          var successHtml =
            '<div class="ff-panel"><div class="ff-success"><h3 style="margin:0 0 8px;font-size:24px;">Thank you</h3><p style="margin:0;color:#475569;font-size:14px;">Your response has been submitted successfully.</p></div></div>';

          if (options.inlineMode) {
            renderFrame(successHtml, options);
          } else {
            var overlayContent =
              '<button class="ff-button" type="button">Feedback</button>' +
              '<div class="ff-overlay ff-open"><div class="ff-card">' +
              successHtml +
              "</div></div>";
            renderFrame(overlayContent, options);

            var newOverlay = shadowRoot.querySelector(".ff-overlay");
            var newButton = shadowRoot.querySelector(".ff-button");
            newOverlay.addEventListener("click", function (overlayEvent) {
              if (overlayEvent.target === newOverlay) {
                newOverlay.classList.remove("ff-open");
              }
            });
            newButton.addEventListener("click", function () {
              newOverlay.classList.add("ff-open");
            });
          }
        })
        .catch(function (error) {
          errorNode.textContent = error.message || "Unable to submit right now";
          errorNode.classList.add("ff-show");
          submitButton.disabled = false;
          submitButton.textContent = formConfig.appearance.submitButtonLabel || "Submit";
        });
    });
  }

  function renderWidget(formConfig) {
    var fontFamilyMap = {
      Inter: "Inter, Arial, sans-serif",
      Poppins: "Poppins, Arial, sans-serif",
      "DM Sans": '"DM Sans", Arial, sans-serif',
      Manrope: "Manrope, Arial, sans-serif",
    };

    var options = {
      themeColor: formConfig.appearance && formConfig.appearance.themeColor,
      fontFamily:
        fontFamilyMap[(formConfig.appearance && formConfig.appearance.font) || "Inter"] ||
        "Inter, Arial, sans-serif",
      inlineMode: (formConfig.appearance && formConfig.appearance.position) === "inline",
    };

    mountHost(options.inlineMode ? "inline" : "floating");

    if (!formConfig.isActive) {
      renderMessage("This form is currently unavailable", options);
      return;
    }

    if (formConfig.hasReachedLimit) {
      renderMessage("This form is now closed", options);
      return;
    }

    var fieldsHtml = [];
    for (var i = 0; i < formConfig.fields.length; i += 1) {
      fieldsHtml.push(buildFieldHtml(formConfig.fields[i], i));
    }

    var panelHtml =
      '<div class="ff-panel">' +
      '<div class="ff-header">' +
      '<div>' +
      '<h2 class="ff-title">' +
      escapeHtml(formConfig.title) +
      "</h2>" +
      (formConfig.description
        ? '<p class="ff-description">' + escapeHtml(formConfig.description) + "</p>"
        : "") +
      "</div>" +
      (!options.inlineMode ? '<button type="button" class="ff-close" aria-label="Close">×</button>' : "") +
      "</div>" +
      '<form class="ff-form">' +
      fieldsHtml.join("") +
      '<div class="ff-error"></div>' +
      '<button type="submit" class="ff-submit">' +
      escapeHtml(
        (formConfig.appearance && formConfig.appearance.submitButtonLabel) || "Submit"
      ) +
      "</button>" +
      "</form>" +
      "</div>";

    if (options.inlineMode) {
      renderFrame(panelHtml, options);
    } else {
      renderFrame(
        '<button class="ff-button" type="button">Feedback</button><div class="ff-overlay"><div class="ff-card">' +
          panelHtml +
          "</div></div>",
        options
      );
    }

    attachInteractiveHandlers(formConfig, options);
  }

  if (!formId) {
    mountHost("inline");
    renderMessage("Invalid widget setup: missing form id.", { inlineMode: true });
    return;
  }

  fetch(apiBase + "/api/public/forms/" + formId)
    .then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error(data.message || "Unable to load form");
        }
        return data;
      });
    })
    .then(function (formConfig) {
      renderWidget(formConfig);
    })
    .catch(function (error) {
      mountHost("inline");
      renderMessage(error.message || "Unable to load form right now.", { inlineMode: isInlineHost });
    });
})();
