document.addEventListener("DOMContentLoaded", function () {
  const $ = jQuery;
  const siteList = $("#wp-admin-bar-my-sites-list").children();
  createElements();

  function createElements() {
    // Create elements for the input / searchbar
    const div = $("<div>");
    const input = $("<input>");
    const button = $("<button>");

    input
      .attr({
        id: "multisite-input",
        placeholder: "Search Sites",
        class: "multisite-searchbar__input",
      })
      .on("input", function (e) {
        filterList(siteList, e.currentTarget.value);
      })
      .focusout(clearInput);

    button
      .addClass("multisite-searchbar__cancel-button")
      .html("&#215")
      .click(clearInput);

    // div will be the container for the input and button
    div.attr({ id: "multisite-searchbar" }).append(input, button);

    // This places the div after the selector
    $("#wp-admin-bar-network-admin").after(div);

    return { div, button, input };
  }

  function filterList(list, searchStr) {
    // if the input field is empty, display all elements
    if (!searchStr) {
      for (let elem of list) {
        $(elem).show();
      }
      return;
    }

    // if the user inputs a number, they're probably searching for a blog ID
    if (searchStr.match(/^[0-9]*$/)) {
      for (let listItem of list) {
        const elem = $(listItem);
        // Get the blog id and club name
        const blogId = elem.children()[0].innerText;

        if (!blogId.includes(searchStr)) {
          elem.hide();
        } else {
          elem.show();
        }
      }
      return;
    }

    // In any other case, convert our searchString to lowercase
    const search = searchStr.toLowerCase();

    for (let listItem of list) {
      const elem = $(listItem);

      // Get the blog id and club name from the DOM
      let text = elem.children()[0].innerText.toLowerCase();

      // Remove the blog id from the text, so we can just search the club name
      text = text.split(/\s(.+)/)[1];

      // A tripwire for the following for loop
      let inList = true;

      for (let i = 0; i < search.length; i++) {
        // If the search doesn't match an element, hide it and break out of the loop
        if (search[i] !== text[i]) {
          inList = false;
          elem.hide();
          break;
        }
      }
      // If the search string still matches an element in the list, show the element
      if (inList) {
        elem.show();
      }
    }
  }

  function clearInput() {
    $("#multisite-input").val("");

    // Forces list back to initial state
    filterList(siteList);
  }
});
