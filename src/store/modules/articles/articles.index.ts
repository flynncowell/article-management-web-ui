import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { apiGET, apiHandleError } from '@/utility/api/api';
import Vue from 'vue';

@Module({ name: 'articles' })
export default class ArticlesModule extends VuexModule {
  allArticles: Article[] = [];
  currentArticle: Article = null;
  articlesSortedBy = {
    name: '',
    direction: true
  };
  @Action
  getAllArticles(payload: Payload) {
    apiGET('articles')
      .then(res => res.json())
      .then(res => {
        if (apiHandleError(res)) {
          console.log('ARTICLES', res);
          this.all(res);
          if (payload.refresh) {
            payload.vm.$notify({ type: 'success', message: 'Successfully Refreshed' });
          }
        } else {
          payload.vm.$notify({ type: 'warning', message: 'Access Denied' });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  @Mutation
  all(payload: Article[]) {
    this.allArticles = payload;
  }
  @Mutation
  current(payload: Article) {
    this.currentArticle = payload;
  }
  @Mutation
  resetArticlesSortedBy() {
    this.articlesSortedBy = {
      name: '',
      direction: true
    };
  }
  @Mutation
  sortAllBy(payload: { attribute: string }) {
    const direction =
      this.articlesSortedBy.name === payload.attribute
        ? ((this.articlesSortedBy.direction = !this.articlesSortedBy.direction), this.articlesSortedBy.direction)
        : ((this.articlesSortedBy.direction = true), this.articlesSortedBy.direction);

    this.articlesSortedBy.name = payload.attribute;

    this.allArticles = this.allArticles.sort((a, b) => {
      if (typeof a[payload.attribute] === 'string') {
        if (a[payload.attribute] > b[payload.attribute]) {
          return direction ? 1 : -1;
        }
        if (b[payload.attribute] > a[payload.attribute]) {
          return direction ? -1 : 1;
        }
      } else if (a[payload.attribute] && b[payload.attribute] && payload.attribute === 'editors') {
        if (a[payload.attribute][0].name > b[payload.attribute][0].name) {
          return direction ? 1 : -1;
        }
        if (b[payload.attribute][0].name > a[payload.attribute][0].name) {
          return direction ? -1 : 1;
        }
      } else if (a[payload.attribute] && b[payload.attribute] && payload.attribute === 'subject') {
        if (a[payload.attribute].name > b[payload.attribute].name) {
          return direction ? 1 : -1;
        }
        if (b[payload.attribute].name > a[payload.attribute].name) {
          return direction ? -1 : 1;
        }
      }

      return 0;
    });
  }
}
interface Payload {
  vm: Vue;
  refresh?: boolean;
}

export interface Article {
  authors: [];
  copyright: string;
  date: Date;
  type: ArticleType;
  status: ArticleStatus;
  subject: { name: string; id: string };
  docId: string;
  deadline: Date;
  notes: string;
  folderId: string;
  markingGridId: string;
  trashed: boolean;
  summary: string;
  reason: string;
  modified: Date;
  wordpressId: number;
  hasPlagiarism: boolean;
  editors: {};
  link: string;
}
enum ArticleType {
  'ReviewArticle' = 'Review Article',
  'Blog' = 'Blog',
  'OriginalResearch' = 'Original Research',
  'MagazineArticle' = 'Magazine Article'
}
enum ArticleStatus {
  'InReview' = 'In Review',
  'FailedDataCheck' = 'Failed Data Check',
  'PassedDataCheck' = 'Passed Data Check',
  'TechnicalReview' = 'Technical Review',
  'RevisionsRequested' = 'Revisions Requested',
  'ReadytoPublish' = 'Ready to Publish',
  'Published' = 'Published',
  'Submitted' = 'Submitted',
  'Rejected' = 'Rejected',
  'FinalReview' = 'Final Review',
  '2ndEditorRequired' = '2nd Editor Required',
  'EthicalQuestion' = 'Ethical Question'
}