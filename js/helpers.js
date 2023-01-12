const helpers = {
    create: function(tag) {
        return document.createElement(tag)
    },
    findOne: function(selector) {
        return document.querySelector(selector)
    },
    findSome: function(selector) {
        return document.querySelectorAll(selector)
    },
    shuffle: function(array) {
      let currentIndex = array.length,  randomIndex;
    
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
    
      return array;
    },
    getRandomItem: function(array) {
      return array[Math.floor(Math.random()*array.length)]
    },
    secToTime: function(sec) {
      var minutes = Math.floor(sec / 60)
      var seconds = sec - (minutes * 60)

      if (minutes < 10) minutes = minutes
      if (seconds < 10) seconds = "0" + seconds
      return minutes+':'+seconds;
    },
    sum: function(arr) {
      if (!Array.isArray(arr)) throw new Error("function sum accepts only an array")
      if (!arr.every(i => typeof i === "number")) throw new Error("function sum: check array elements to be a number")
      return arr.reduce((acc, val) => acc + val);
    }
      
}

export default helpers
