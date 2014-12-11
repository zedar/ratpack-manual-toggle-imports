/**
 *  Simple unique id generator
 */
function _uniqueId(base) {
  // check to see if statis id_count has been defined
  if (typeof _uniqueId.id_count === "undefined") {
      _uniqueId.id_count = 0;
  }
  else {
    ++_uniqueId.id_count;
  }
  return (base ? base : "ui-") + (++_uniqueId.id_count);
}

/**
 *  Show/hide imports in java or groovy code snippets
 *  @param context  - one of: java, groovy
 *  @param action   - one of: show, hide
 */
function toggleImports(context, action, callback) {
  if (!context || $.inArray(context, ["java", "groovy"]) === -1) {
    return;
  }
  if (!action || $.inArray(action, ["show", "hide"]) === -1) {
    return;
  }

  $("code.language-" + context).each(function(idx) {
    var firstEntry = true;
    $(this)
      .children("span.token.keyword")
        .filter(function() { return $(this).text() === "import"; })
          .each(function(jdx, el) {
            if (action === "hide" && firstEntry) {
              var uid = _uniqueId("showImports-");
              $(el).before("<span class=\"token keyword\" id=\"" + uid + "\">import ...\n\n</span>");
              $("#" + uid).css("cursor", "pointer").click(function() {
                if (typeof callback === "function") {
                  callback(context, "#" + uid);
                }
              });
              firstEntry = false;
            }
            var t = [el];
            var l = $(el).siblings().length;
            var _continue = l;
            var n = el;
            while (_continue) {
              var nes = n.nextElementSibling;
              if (action === "hide" && n.nextSibling && n.nextSibling.nodeType === 3) {
                var txt = n.nextSibling.textContent;
                if (txt) {
                  n.nextSibling.textContent = "";
                  $(n).after("<span>" + txt + "</span>");
                  t[t.length] = n.nextElementSibling;
                }
              }
              if (nes) {
                t[t.length] = nes;
                var ns = nes.nextSibling, 
                    nsIsText = ns && ns.nodeType === 3 && ns.textContent;

                if (context === "java" && $(nes).text() === ";" ||
                    context === "groovy" && $(nes).text().indexOf("\n") >= 0 ||
                    context === "groovy" && nsIsText) {
                  if (action === "hide" && 
                        nes.nextSibling &&
                          nes.nextSibling.nodeType === 3 &&
                            nes.nextSibling.textContent &&
                              nes.nextSibling.textContent.indexOf("\n") >= 0) {
                    var txt2 = nes.nextSibling.textContent, crIdx = txt2.indexOf("\n");
                    for (++crIdx; crIdx < txt2.length; crIdx++) {
                      if (txt2[crIdx] !== "\n") {
                        break;
                      }
                    }
                    var txt2_1 = txt2.substring(0, crIdx);
                    var txt2_2 = txt2.substring(crIdx);
                    if (txt2_2) {
                      nes.nextSibling.textContent = txt2_2;
                    }
                    else {
                      nes.nextSibling.textContent = "";
                    }
                    $(nes).after("<span>" + txt2_1 + "</span>");
                    t[t.length] = nes.nextElementSibling;
                    break;
                  }
                  if (action === "show" &&
                        nes.nextElementSibling) {
                    var txt3 = $(nes.nextElementSibling).text();
                    if (txt3 && txt3.indexOf("\n") >=0) {
                      t[t.length] = nes.nextElementSibling;
                    }
                    break;
                  }
                }
                if ($(nes).text().indexOf("\n") >= 0) {
                  break;
                }
                n = nes;
                l--;
              }
              else {
                break;
              }
            }
            $.each(t, function(kdx, v) {
              if (action === "hide") {
                $(v).hide();
              }
              else if (action === "show") {
                $(v)
                  .show()
                    .css("cursor", "pointer")
                      .off("click")
                        .click(function() {
                          if (typeof callback === "function") {
                            callback(context);
                          }
                        });
              }
            });
          });
  });
}

var showImports, hideImports;

showImports = function(context, toggleEl) {
  if (toggleEl) {
    $(toggleEl).remove();
  }
  else {
    return;
  }
  toggleImports(context, "show", hideImports);
};

hideImports = function(context) {
  toggleImports(context, "hide", showImports);
};

$(function() {
  hideImports("java");
  hideImports("groovy");
});

