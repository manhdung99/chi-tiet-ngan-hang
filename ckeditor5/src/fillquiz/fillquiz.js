/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import FillQuizEditing from "./fillquizediting";
import FillQuizUI from "./fillquizui";

export default class FillQuiz extends Plugin {
  static get requires() {
    return [FillQuizEditing, FillQuizUI];
  }
}
