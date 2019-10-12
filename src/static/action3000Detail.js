const testData = {
  meta: {
    additionalHeaders: [
      {
        text: 'Version1',
        value: 'additional_version1',
        sort: true,
      },
      {
        text: 'Version2',
        value: 'additional_version2',
      },
      {
        text: 'Version3',
        value: 'additional_version3',
      },
      {
        text: 'Version4',
        value: 'additional_version4',
      },
    ],
    entityList: [
      { id: '1000000000000023', name: 'PAS2015' },
      { id: '1000000000000044', name: 'PAS2018(SXB)' },
      { id: '1000000000000054', name: 'BAR2018' },
      { id: '10000000000000XX', name: 'BAR2019' },
      { id: '10000000000000XX', name: 'HA2019(HK/HK2)' },
    ],
  },
  logInfo: {
    typeId: 3000,
    name: 'pressKey',
    description:
      'セット本体のH/Wボタンと、リモコンのボタンについて、ユーザーがどのボタンをよく利用するか、使用した回数と共に取得する',
    timing:
      '・セット本体のH/W キー、リモコンキー、 mobile appでキーを操作したとき\n・実際にログとしてセットされるのは、setPowerOff が呼ばれるタイミングで、logUtilにセットする。この時、ログとしてセットしたので、内部で保持していたカウンタはクリアが必要',
    example: JSON.stringify(
      {
        actionTypeId: 3000,
        action: {
          controlDevice: 'device',
          listCount: 2,
          keyInfo: [{ keyId: 3, count: 6, type: 'short' }, { keyId: 5, count: 4, type: 'long' }],
        },
      },
      null,
      '\t'
    ),
    remark:
      '・ログ送信モジュール側で、何回キーが押されたかをメモリ上に保存しておく。 電源OFF時に LogUtilに対してカウントしたログデータをセットする。\n・LogUtilには、本体キー、リモコン、モバイルappの controlDevice 毎に分けてセットする。 該当するcontrolDeviceから入力が無かった場合、そのcontrolDeviceを指定したログはLogUtilにセットしない',
    latestVersion: '4',
    entityList: [
      { id: '1000000000000023', name: 'PAS2015' },
      { id: '1000000000000044', name: 'PAS2018(SXB)' },
      { id: '1000000000000054', name: 'BAR2018' },
      { id: '10000000000000XX', name: 'BAR2019' },
      { id: '10000000000000XX', name: 'HA2019(HK/HK2)' },
    ],
  },
  keyInfo: [
    {
      id: 1,
      class: 'action',
      key: 'controlDevice',
      type: 'String',
      restriction: { min: 1, max: 16 },
      mandatory: 'REQUIRED',
      value: '(Single Select)',
      sample: 'device',
      description: 'controller',
      show: true,
      valueInfo: [
        {
          class: '',
          key: '',
          value: 'device',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version1',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version2',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '',
          key: '',
          value: 'remote',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version1',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version2',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '',
          key: '',
          value: 'other',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version2',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '',
          key: '',
          value: 'cec',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '',
          key: '',
          value: 'bt_avrcp',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '',
          key: '',
          value: 'cisip',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '',
          key: '',
          value: 'companionApp',
          type: '',
          description: '',
          restriction: null,
          mandatory: null,
          sample: '',
          show: true,
          additionalInfo: [
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
      ],
      additionalInfo: [
        {
          key: 'version1',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version2',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version3',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version4',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
      ],
    },
    {
      id: 2,
      class: 'action',
      key: 'listCount',
      type: 'Long',
      restriction: { min: 0, max: 2 ** 31 - 1 },
      mandatory: 'REQUIRED',
      sample: 2,
      description: '',
      additionalInfo: [
        {
          key: 'version1',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version2',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version3',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version4',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
      ],
    },
    {
      id: 3,
      class: 'action',
      key: 'keyInfo',
      type: 'Object',
      typeName: 'keyInfo[]', // optional alias
      restriction: { min: 1, max: 128 },
      mandatory: 'REQUIRED',
      // value: '{keyInfo}',

      sample: null,
      description: 'The ID indicate the event in app.',
      additionalInfo: [
        {
          key: 'version1',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version2',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version3',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
        {
          key: 'version4',
          value: 'active',
          options: {
            type: 'chip',
            textColor: 'white',
            color: '#33691E',
          },
        },
      ],
      objectInfo: [
        {
          class: '{keyInfo}',
          key: 'keyId',
          value: '',
          type: 'Integer',
          description: 'SVS defined key Id\n現状、MAXで255個までのキー設定で足りる想定',
          restriction: null,
          mandatory: 'REQUIRED',
          sample: '3',
          show: true,
          additionalInfo: [
            {
              key: 'version1',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version2',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '{keyInfo}',
          key: 'count',
          value: '',
          type: 'Integer',
          description: '',
          restriction: { min: 0, max: 2 ** 31 - 1 },
          mandatory: 'REQUIRED',
          sample: '6',
          show: true,
          additionalInfo: [
            {
              key: 'version1',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version2',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
        {
          class: '{keyInfo}',
          key: 'type',
          value: '(Single Select)',
          type: 'String',
          description: '',
          restriction: null,
          mandatory: 'REQUIRED',
          sample: '',
          show: true,
          valueInfo: [
            {
              class: '',
              key: '',
              value: 'short',
              type: '',
              description:
                '押した時、離したとき、どちらで判定するかはセット依存とする。e.g） プログラムが短押しと判定するのは、pushなのかreleaseのどちらのタイミングか',
              restriction: null,
              mandatory: null,
              sample: '',
              show: true,
              additionalInfo: [
                {
                  key: 'version3',
                  value: 'active',
                  options: {
                    type: 'chip',
                    textColor: 'white',
                    color: '#33691E',
                  },
                },
                {
                  key: 'version4',
                  value: 'active',
                  options: {
                    type: 'chip',
                    textColor: 'white',
                    color: '#33691E',
                  },
                },
              ],
            },
            {
              class: '',
              key: '',
              value: 'long',
              type: '',
              description: '',
              restriction: null,
              mandatory: null,
              sample: '',
              show: true,
              additionalInfo: [
                {
                  key: 'version3',
                  value: 'active',
                  options: {
                    type: 'chip',
                    textColor: 'white',
                    color: '#33691E',
                  },
                },
                {
                  key: 'version4',
                  value: 'active',
                  options: {
                    type: 'chip',
                    textColor: 'white',
                    color: '#33691E',
                  },
                },
              ],
            },
          ],
          additionalInfo: [
            {
              key: 'version2',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version3',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
            {
              key: 'version4',
              value: 'active',
              options: {
                type: 'chip',
                textColor: 'white',
                color: '#33691E',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default testData;
