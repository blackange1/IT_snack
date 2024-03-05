import axios from "axios";
import {urlDjango} from "./_config"

axios.get(`${urlDjango}/hello-world/`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });