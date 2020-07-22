import {
  ReadPreferenceMode,
  Compressor,
  ReadConcernLevel,
  AuthMechanism,
  LogLevel,
  UriOptions,
  ClientOptions
} from './types';
import { Coerce as C, CoerceMatch, CoerceOptions } from './coerce';

// prettier-ignore
export class CoerceCustom {
  /** ensure object is in the shape of a ReadPreference */
  static readPreference = C.warn(C.objectExact(match => ({
    ...match('mode', C.default(C.enum({ ReadPreferenceMode }), 'primary')),
    ...match('maxStalenessSeconds', C.number),
    ...match('tags', C.default(C.tags, [])),
    ...match('hedge', C.objectExact(match => ({
      ...match('enable', C.require(C.boolean))
    })))
  })));
  static readPreferenceOption = C.union(C.enum({ ReadPreferenceMode }), CoerceCustom.readPreference);
  static authMechanismProperties = C.warn(C.objectExact(match => ({
    ...match('SERVICE_NAME', C.string),
    ...match('CANONICALIZE_HOST_NAME', C.boolean),
    ...match('SERVICE_REALM', C.string),
  })))
  static authMechanismPropertiesString = C.compose(C.keyValue, CoerceCustom.authMechanismProperties)
  static authMechanismPropertiesOption = C.union(
    CoerceCustom.authMechanismPropertiesString,
    CoerceCustom.authMechanismProperties
  );
  static uriOptionsDef= (match: CoerceMatch) => ({
    ...match('replicaSet', C.string),
    ...match('tls', C.default(C.boolean, false)),
    ...match('ssl', C.deprecate(C.default(C.boolean, false), 'tls')),
    ...match('tlsCertificateKeyFile', C.string),
    ...match('tlsCertificateKeyFilePassword', C.string),
    ...match('tlsCAFile', C.string),
    ...match('tlsAllowInvalidCertificates', C.default(C.boolean, false)),
    ...match('tlsAllowInvalidHostnames', C.default(C.boolean, false)),
    ...match('tlsInsecure', C.default(C.boolean, false)),
    ...match('connectTimeoutMS', C.default(C.number, 10000)),
    ...match('socketTimeoutMS', C.default(C.number, 360000)),
    ...match('compressors', C.array(C.enum({ Compressor }))),
    ...match('zlibCompressionLevel', C.default(C.number, 0)),
    ...match('maxPoolSize', C.default(C.number, 5)),
    ...match('minPoolSize', C.default(C.number, 0)),
    ...match('maxIdleTimeMS', C.number),
    ...match('waitQueueMultiple', C.number),
    ...match('waitQueueTimeoutMS', C.number),
    ...match('w', C.default(C.union(C.number, C.given('majority')), 1)),
    ...match('wtimeoutMS', C.number),
    ...match('journal', C.boolean),
    ...match('readConcernLevel', C.default(C.enum({ ReadConcernLevel }), ReadConcernLevel.local)),
    ...match('readPreference', C.default(CoerceCustom.readPreferenceOption, ReadPreferenceMode.primary)),
    ...match('maxStalenessSeconds', C.number),
    ...match('readPreferenceTags', C.tags),
    ...match('authSource', C.string),
    ...match('authMechanism', C.default(C.enum({ AuthMechanism }), AuthMechanism.DEFAULT)),
    ...match('authMechanismProperties', CoerceCustom.authMechanismPropertiesOption),
    ...match('gssapiServiceName', C.string),
    ...match('localThresholdMS', C.number),
    ...match('serverSelectionTimeoutMS', C.number),
    ...match('serverSelectionTryOnce', C.boolean),
    ...match('heartbeatFrequencyMS', C.number),
    ...match('appName', C.string),
    ...match('retryWrites', C.default(C.boolean, true)),
    ...match('retryWrites', C.default(C.boolean, true)),
    ...match('directConnection', C.default(C.boolean, true))
  })
  static driverOptionsDef = (match: CoerceMatch) => ({
    ...match('poolSize', C.default(C.number, 5)),
    ...match('sslValidate', C.default(C.boolean, false)),
    ...match('sslCA', C.buffer),
    ...match('sslCert', C.buffer),
    ...match('sslKey', C.buffer),
    ...match('sslPass', C.string),
    ...match('sslCRL', C.buffer),
    ...match('checkServerIdentity', C.union(C.boolean, C.function)),
    ...match('autoReconnect', C.default(C.boolean, true)),
    ...match('auto_reconnect', C.default(C.boolean, true)),
    ...match('noDelay', C.default(C.boolean, true)),
    ...match('keepAlive', C.default(C.boolean, true)),
    ...match('keepAliveInitialDelay', C.default(C.number, 30000)),
    ...match('family', C.default(C.union(C.null, C.given(4), C.given(6)), null)),
    ...match('reconnectTries', C.default(C.number, 30)),
    ...match('reconnectInterval', C.default(C.number, 1000)),
    ...match('ha', C.default(C.boolean, true)),
    ...match('haInterval', C.default(C.number, 10000)),
    ...match('secondaryAcceptableLatencyMS', C.default(C.number, 15)),
    ...match('acceptableLatencyMS', C.default(C.number, 15)),
    ...match('connectWithNoPrimary', C.default(C.boolean, false)),
    ...match('wtimeout', C.number),
    ...match('j', C.boolean),
    ...match('forceServerObjectId', C.default(C.boolean, false)),
    ...match('serializeFunctions', C.default(C.boolean, false)),
    ...match('ignoreUndefined', C.default(C.boolean, false)),
    ...match('raw', C.default(C.boolean, false)),
    ...match('bufferMaxEntries', C.default(C.number, -1)),
    ...match('pkFactory', C.any),
    ...match('promiseLibrary', C.any),
    ...match('readConcern', CoerceCustom.readConcern),
    ...match('loggerLevel', C.default(C.enum({ LogLevel }), LogLevel.error)),
    ...match('logger', C.any),
    ...match('promoteValues', C.default(C.boolean, true)),
    ...match('promoteBuffers', C.default(C.boolean, false)),
    ...match('promoteLongs', C.default(C.boolean, true)),
    ...match('domainsEnabled', C.default(C.boolean, false)),
    ...match('validateOptions', C.default(C.boolean, false)),
    ...match('appname', C.string),
    ...match('auth', CoerceCustom.auth),
    ...match('compression', C.enum({ Compressor })),
    ...match('fsync', C.default(C.boolean, false)),
    ...match('numberOfRetries', C.default(C.number, 5)),
    ...match('monitorCommands', C.default(C.boolean, false)),
    ...match('minSize', C.number),
    ...match('useNewUrlParser', C.default(C.boolean, true)),
    ...match('useUnifiedTopology', C.default(C.boolean, false)),
    ...match('autoEncryption', C.any),
    ...match('driverInfo', CoerceCustom.driverInfo),
  })
  static readConcern = C.warn(C.objectExact(match => ({
    ...match('level', C.default(C.enum({ ReadConcernLevel }), ReadConcernLevel.local))
  })))
  static auth = C.warn(C.objectExact(match => ({
    ...match('user', C.string),
    ...match('pass', C.string)
  })))
  static driverInfo = C.warn(C.objectExact(match => ({
    ...match('name', C.string),
    ...match('version', C.string),
    ...match('platform', C.string)
  })))

  static uriOptions = (uriOptions: UriOptions, options?: CoerceOptions) => {
    return C.require(C.warn(C.object(CoerceCustom.uriOptionsDef)))(uriOptions, options);
  }
  static clientOptions = (clientOptions: ClientOptions) => {
    return C.require(C.warn(C.object(CoerceCustom.uriOptionsDef, CoerceCustom.driverOptionsDef)))(clientOptions);
  }

  static readPreferenceFromOptions (options: ReturnType<typeof CoerceCustom['clientOptions']>) {
    const tags = (() => {
      const a = (typeof options.readPreference !== 'string' && options?.readPreference?.tags) || [];
      const b = options.readPreferenceTags || []
      return [...a, ...b];
    })()

    const hedge = (() => {
      if (typeof options.readPreference === 'string') return undefined;
      return options?.readPreference?.hedge;
    })()

    const mode = (() => {
      if (typeof options.readPreference === 'string') return options.readPreference
      return options?.readPreference.mode
    })()

    const maxStalenessSeconds = (() => {
      if (typeof options.readPreference === 'string') return options.maxStalenessSeconds
      return options?.readPreference.maxStalenessSeconds
    })()

    return C.require(CoerceCustom.readPreference)({ mode, hedge, tags, maxStalenessSeconds }, { warn: false } )
  }

  static mongoClientOptions = (uriOptions: UriOptions, clientOptions: ClientOptions) => {
    const parsedUriOptions = CoerceCustom.uriOptions(uriOptions, { applyDefaults: false, warnDeprecated: false });
    const options = CoerceCustom.clientOptions(Object.assign({}, parsedUriOptions, clientOptions))
    // standardizes "tandem" or "alias" properties
    const appName = options.appName ?? options.appname
    const autoReconnect = options.autoReconnect ?? options.auto_reconnect;
    const maxPoolSize = (options.maxPoolSize !== 5 && options.maxPoolSize) || (options.poolSize !== 5 && options.poolSize) || 5
    const wtimeoutMS = options.wtimeoutMS ?? options.wtimeout;
    const readPreference = CoerceCustom.readPreferenceFromOptions(options);
    const tls = options.ssl || options.tls;
    const j = options.j || options.journal;
    const readConcernLevel =
      (options.readConcern?.level !== ReadConcernLevel.local && options.readConcern?.level) ||
      (options.readConcernLevel !== ReadConcernLevel.local && options.readConcernLevel) ||
      ReadConcernLevel.local
    const readConcern = { ...options.readConcern, level: readConcernLevel };
    const compressors = [ ...options.compressors, ...(options.compression ? [options.compression]: []) ];
    const writeConcern = { j: options.journal, w: options.w, wtimeout: wtimeoutMS }
    return {
      ...options,
      appName,
      appname: appName,
      autoReconnect: autoReconnect,
      auto_reconnect: autoReconnect,
      maxPoolSize: maxPoolSize,
      poolSize: maxPoolSize,
      j,
      journal: j,
      readPreference,
      wtimeoutMS,
      wtimeout: wtimeoutMS,
      tls,
      ssl: tls,
      readConcernLevel,
      readConcern,
      compressors,
      compression: compressors[0],
      writeConcern
    }
  }
}
