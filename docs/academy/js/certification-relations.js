/**
 * CyberPath Academy
 * Certification Relations — Display Layer
 *
 * Purpose:
 * - Load the centralized certification relations data.
 * - Detect the current certification.
 * - Render only the relations for the current certification.
 *
 * Architecture:
 * - Source of truth:
 *   ../data/certification-relations.json
 *
 * - Display layer only:
 *   This file does not modify certification data.
 *
 * - Does not rebuild certification pages.
 */

(function () {
  'use strict';

  /*
   * ---------------------------------------------------------
   * Configuration
   * ---------------------------------------------------------
   */

  const RELATIONS_URL =
    '../../../data/certification-relations.json';

  /*
   * Certification pages are nested under a provider folder:
   * /academy/certifications/{provider}/{slug}/
   * so building a correct link requires knowing the provider
   * for the target id. This map reflects the actual current
   * folder structure (verified against the repository), not
   * new data — it is a navigation lookup only.
   */
  const CERTIFICATION_PROVIDER_MAP = {
    'cloud-practitioner': 'aws',
    'security-specialty': 'aws',
    'solutions-architect': 'aws',
    'ccna': 'cisco',
    'ccnp-security': 'cisco',
    'cyberops': 'cisco',
    'devnet-associate': 'cisco',
    'cysa-plus': 'comptia',
    'linux-plus': 'comptia',
    'network-plus': 'comptia',
    'pentest-plus': 'comptia',
    'security-plus': 'comptia',
    'ceh': 'ec-council',
    'chfi': 'ec-council',
    'cnd': 'ec-council',
    'ecsa': 'ec-council',
    'cisa': 'isaca',
    'cism': 'isaca',
    'crisc': 'isaca',
    'cc': 'isc2',
    'cissp': 'isc2',
    'sscp': 'isc2',
    'ai-900': 'microsoft',
    'az-500': 'microsoft',
    'dp-900': 'microsoft',
    'ms-900': 'microsoft',
    'pl-900': 'microsoft',
    'sc-900': 'microsoft',
    'oscp': 'offsec',
    'osed': 'offsec',
    'osep': 'offsec',
    'oswe': 'offsec'
  };

  const CERTIFICATIONS_BASE_URL =
    '/academy/certifications/';

  /*
   * Real certification names, extracted verbatim from each
   * page's own <h1 class="cert-title"> (not new content).
   * Used so the user never sees a raw id like "cysa-plus".
   */
  const CERTIFICATION_NAME_MAP = {
    'cloud-practitioner': 'AWS Cloud Practitioner',
    'security-specialty': 'AWS Security Specialty',
    'solutions-architect': 'AWS Solutions Architect Associate',
    'ccna': 'Cisco CCNA',
    'ccnp-security': 'Cisco CCNP Security',
    'cyberops': 'Cisco CyberOps Associate',
    'devnet-associate': 'Cisco DevNet Associate',
    'cysa-plus': 'CompTIA CySA+',
    'linux-plus': 'CompTIA Linux+',
    'network-plus': 'CompTIA Network+',
    'pentest-plus': 'CompTIA PenTest+',
    'security-plus': 'CompTIA Security+',
    'ceh': 'EC-Council CEH',
    'chfi': 'EC-Council CHFI',
    'cnd': 'EC-Council CND',
    'ecsa': 'EC-Council ECSA',
    'cisa': 'ISACA CISA',
    'cism': 'ISACA CISM',
    'crisc': 'ISACA CRISC',
    'cc': 'ISC2 Certified in Cybersecurity (CC)',
    'cissp': 'ISC2 CISSP',
    'sscp': 'ISC2 SSCP',
    'ai-900': 'Microsoft AI-900',
    'az-500': 'Microsoft AZ-500',
    'dp-900': 'Microsoft DP-900',
    'ms-900': 'Microsoft MS-900',
    'pl-900': 'Microsoft PL-900',
    'sc-900': 'Microsoft SC-900',
    'oscp': 'OffSec OSCP',
    'osed': 'OffSec OSED',
    'osep': 'OffSec OSEP',
    'oswe': 'OffSec OSWE'
  };


  /*
   * ---------------------------------------------------------
   * Relation Type Labels
   * ---------------------------------------------------------
   */

  const TYPE_LABELS = {
    nextLevel: 'الخطوة التالية',
    complementary: 'شهادة مكملة',
    alternative: 'بديل محتمل'
  };


  /*
   * ---------------------------------------------------------
   * Detect Current Certification
   * ---------------------------------------------------------
   *
   * Priority:
   *
   * 1. <body data-certification-id="security-plus">
   *
   * 2. window.CERTIFICATION_ID
   *
   * 3. URL path fallback
   *
   */

  function getCurrentCertificationId() {

    // 1. Read from body data attribute
    const bodyId =
      document.body &&
      document.body.dataset &&
      document.body.dataset.certificationId;

    if (bodyId) {
      return bodyId.trim();
    }


    // 2. Read from global variable
    if (
      typeof window.CERTIFICATION_ID === 'string' &&
      window.CERTIFICATION_ID.trim()
    ) {
      return window.CERTIFICATION_ID.trim();
    }


    // 3. Detect from URL
    const path =
      window.location.pathname.replace(/\/+$/, '');

    const marker =
      '/certifications/';

    const markerIndex =
      path.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }


    const remainder =
      path.slice(markerIndex + marker.length);

    const parts =
      remainder.split('/').filter(Boolean);


    /*
     * Current certification pages are expected
     * to be nested under a provider.
     *
     * Example:
     *
     * /academy/certifications/comptia/security-plus/
     *
     * Result:
     *
     * security-plus
     */

    if (parts.length >= 2) {
      return parts[parts.length - 1];
    }

    return null;
  }


  /*
   * ---------------------------------------------------------
   * Load Certification Relations
   * ---------------------------------------------------------
   */

  async function loadRelations() {

    const response =
      await fetch(RELATIONS_URL, {
        cache: 'no-store'
      });


    if (!response.ok) {

      throw new Error(
        'Failed to load certification relations: HTTP ' +
        response.status
      );
    }


    const data =
      await response.json();


    if (!Array.isArray(data)) {

      throw new Error(
        'Certification relations data must be an array.'
      );
    }


    return data;
  }


  /*
   * ---------------------------------------------------------
   * Get Relations For Current Certification
   * ---------------------------------------------------------
   *
   * Only relations where:
   *
   * relation.source === current certification
   *
   * are displayed.
   */

  function getRelatedRelations(
    relations,
    certificationId
  ) {

    if (
      !Array.isArray(relations) ||
      !certificationId
    ) {
      return [];
    }


    return relations.filter(function (relation) {

      return (
        relation &&
        relation.source === certificationId &&
        relation.target &&
        relation.type
      );

    });
  }


  /*
   * ---------------------------------------------------------
   * Certification URL
   * ---------------------------------------------------------
   *
   * The target uses the existing certification slug.
   *
   * Example:
   *
   * ../certifications/security-plus/
   *
   * NOTE:
   * This is intentionally kept simple for Phase 2.
   * Provider-specific URL mapping can be handled during
   * integration if required by the existing repository
   * structure.
   */

  function getCertificationUrl(
    certificationId
  ) {

    const provider =
      CERTIFICATION_PROVIDER_MAP[certificationId];

    if (!provider) {
      // No known page for this id — fail gracefully, do not build a broken link.
      return null;
    }

    return (
      CERTIFICATIONS_BASE_URL +
      encodeURIComponent(provider) + '/' +
      encodeURIComponent(certificationId) +
      '/'
    );
  }


  /*
   * ---------------------------------------------------------
   * Create Relation Card
   * ---------------------------------------------------------
   */

  function createRelationCard(
    relation
  ) {

    const url =
      getCertificationUrl(relation.target);

    if (!url) {
      // Unknown target page — skip rather than render a broken link.
      return null;
    }

    const col =
      document.createElement('div');

    col.className =
      'col-lg-4 col-md-6';

    const article =
      document.createElement('article');

    article.className =
      'certification-relation-card';


    /*
     * Relation Type
     */

    const type =
      document.createElement('span');

    type.className =
      'certification-relation-type';

    type.textContent =
      TYPE_LABELS[relation.type] ||
      relation.type;


    /*
     * Certification Link
     */

    const link =
      document.createElement('a');

    link.className =
      'certification-relation-link';

    link.href = url;

    link.textContent =
      CERTIFICATION_NAME_MAP[relation.target] ||
      relation.target;


    /*
     * Rationale
     */

    const rationale =
      document.createElement('p');

    rationale.className =
      'certification-relation-rationale';

    rationale.textContent =
      relation.rationale || '';


    /*
     * Build Card
     */

    article.appendChild(type);

    article.appendChild(link);


    if (relation.rationale) {
      article.appendChild(rationale);
    }

    col.appendChild(article);

    return col;
  }


  /*
   * ---------------------------------------------------------
   * Render Relations
   * ---------------------------------------------------------
   *
   * Expected HTML container:
   *
   * <div data-certification-relations></div>
   *
   */

  function renderRelations(
    relations,
    container
  ) {

    if (!container) {
      return;
    }


    /*
     * Clear previous content
     */

    container.innerHTML = '';


    /*
     * No relations
     */

    if (!relations.length) {
      return;
    }


    /*
     * Use DocumentFragment for efficient rendering
     */

    const fragment =
      document.createDocumentFragment();


    relations.forEach(function (relation) {

      const card =
        createRelationCard(relation);

      if (card) {
        fragment.appendChild(card);
      }

    });


    container.appendChild(fragment);
  }


  /*
   * ---------------------------------------------------------
   * Main Initializer
   * ---------------------------------------------------------
   */

  async function init() {

    /*
     * Find the relations container.
     *
     * If the current page does not contain it,
     * do nothing.
     */

    const container =
      document.querySelector(
        '[data-certification-relations]'
      );


    if (!container) {
      return;
    }


    /*
     * Detect current certification
     */

    const certificationId =
      getCurrentCertificationId();


    if (!certificationId) {
      return;
    }


    try {

      /*
       * Load centralized relation data
       */

      const relations =
        await loadRelations();


      /*
       * Filter relations for current certification
       */

      const related =
        getRelatedRelations(
          relations,
          certificationId
        );


      /*
       * Render
       */

      renderRelations(
        related,
        container
      );

    } catch (error) {

      /*
       * Fail gracefully.
       *
       * A failure here must not affect
       * the rest of the certification page.
       */

      console.error(
        '[CyberPath] Certification relations failed:',
        error
      );


      container.innerHTML = '';
    }
  }


  /*
   * ---------------------------------------------------------
   * Public API
   * ---------------------------------------------------------
   *
   * Useful for testing from browser console.
   *
   * Example:
   *
   * CyberPathCertificationRelations
   *
   */

  window.CyberPathCertificationRelations = {

    init: init,

    getCurrentCertificationId:
      getCurrentCertificationId,

    getRelatedRelations:
      getRelatedRelations

  };


  /*
   * ---------------------------------------------------------
   * Initialization
   * ---------------------------------------------------------
   */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }

})();
