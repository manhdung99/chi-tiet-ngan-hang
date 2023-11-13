import { defineStore } from "pinia";

export const usePopupStore = defineStore("popupStore", {
  state: () => ({
    openAddNewBankModal: false,
    openStatisticsBankModal: false,
    openDeleteQuestionModal: false,
    openDeleteBankModal: false,
    openDuplicateBankModal: false,
    openDuplicateQuestionModal: false,
    openAddNewQuestionHandmadeModal: false,
    openSelectQuestionFromCourse: false,
    openSelectQuestionFromBank: false,
    deleteKey: "",
    duplicateKey: "",
    isLoading: false,
  }),
  getters: {},
  actions: {
    updateAddNewBankModalStatus(status: boolean) {
      this.openAddNewBankModal = status;
    },
    updateDeleteQuestionModalStatus(status: boolean, key = "") {
      this.openDeleteQuestionModal = status;
      this.deleteKey = key;
    },
    updateDeleteBankModalStatus(status: boolean) {
      this.openDeleteBankModal = status;
    },
    updateDuplicateBankModalStatus(status: boolean) {
      this.openDuplicateBankModal = status;
    },
    updateDuplicateQuestionModalStatus(status: boolean, key = "") {
      this.openDuplicateQuestionModal = status;
      this.duplicateKey = key;
    },
    updateAddNewQuestionHandmadeModalStatus(status: boolean) {
      this.openAddNewQuestionHandmadeModal = status;
    },
    updateSelectQuestionFromCourseStatus(status: boolean) {
      this.openSelectQuestionFromCourse = status;
    },
    updateSelectQuestionFromBankStatus(status: boolean) {
      this.openSelectQuestionFromBank = status;
    },
    updateStatisticsBankModalStatus(status: boolean) {
      this.openStatisticsBankModal = status;
    },
    updateLoading(status: boolean) {
      this.isLoading = status;
    },
  },
});
