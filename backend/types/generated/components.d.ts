import type { Schema, Struct } from '@strapi/strapi';

export interface ArticleImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_image_blocks';
  info: {
    displayName: 'imageblock';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.String;
    credit: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files', true> &
      Schema.Attribute.Required;
  };
}

export interface HomepageSectionBlock extends Struct.ComponentSchema {
  collectionName: 'components_homepage_section_blocks';
  info: {
    displayName: 'sectionblock';
    icon: 'layout';
  };
  attributes: {
    layout_type: Schema.Attribute.Enumeration<
      ['Grid4', 'Grid6', 'List', 'Mixed']
    > &
      Schema.Attribute.Required;
    linked_category: Schema.Attribute.Relation<
      'oneToOne',
      'api::category.category'
    >;
    manual_articles: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    >;
    section_style: Schema.Attribute.Enumeration<
      ['default', 'grey-background', 'two-column-left', 'two-column-right']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    section_title: Schema.Attribute.String & Schema.Attribute.Required;
    show_more_button: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'article.image-block': ArticleImageBlock;
      'homepage.section-block': HomepageSectionBlock;
    }
  }
}
