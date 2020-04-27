document.addEventListener("DOMContentLoaded", function () {
  const $ = jQuery;
  const input = $("<input>")
    .attr({
      id: "multisite-search",
      placeholder: "Search Sites",
    })
    .css({
      width: "calc(100% - 22px)",
      padding: "0 11px",
      marginTop: "4px",
      border: "none",
    });

  const siteList = $("#wp-admin-bar-my-sites-list").children();

  $(input).on("input", function (e) {
    filterList(e.currentTarget.value, siteList);
  });

  $("#wp-admin-bar-network-admin").after(input);
});

function filterList(searchStr, list) {
  const $ = jQuery;
  for (let elem of list) {
    const text = $(elem).children()[0].innerText.toLowerCase();
    if (!text.includes(searchStr.toLowerCase())) {
      $(elem).hide();
    } else {
      $(elem).show();
    }
  }
}
