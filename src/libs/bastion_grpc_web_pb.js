/**
 * @fileoverview gRPC-Web generated client stub for bastion
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.bastion = require('./bastion_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.bastion.BastionClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.bastion.BastionPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqAuthPassword,
 *   !proto.bastion.User>}
 */
const methodDescriptor_Bastion_AuthPw = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/AuthPw',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqAuthPassword,
  proto.bastion.User,
  /**
   * @param {!proto.bastion.ReqAuthPassword} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.User.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqAuthPassword,
 *   !proto.bastion.User>}
 */
const methodInfo_Bastion_AuthPw = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.User,
  /**
   * @param {!proto.bastion.ReqAuthPassword} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.User.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqAuthPassword} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.User)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.User>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.authPw =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/AuthPw',
      request,
      metadata || {},
      methodDescriptor_Bastion_AuthPw,
      callback);
};


/**
 * @param {!proto.bastion.ReqAuthPassword} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.User>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.authPw =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/AuthPw',
      request,
      metadata || {},
      methodDescriptor_Bastion_AuthPw);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqAuthPublicKey,
 *   !proto.bastion.User>}
 */
const methodDescriptor_Bastion_AuthPk = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/AuthPk',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqAuthPublicKey,
  proto.bastion.User,
  /**
   * @param {!proto.bastion.ReqAuthPublicKey} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.User.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqAuthPublicKey,
 *   !proto.bastion.User>}
 */
const methodInfo_Bastion_AuthPk = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.User,
  /**
   * @param {!proto.bastion.ReqAuthPublicKey} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.User.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqAuthPublicKey} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.User)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.User>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.authPk =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/AuthPk',
      request,
      metadata || {},
      methodDescriptor_Bastion_AuthPk,
      callback);
};


/**
 * @param {!proto.bastion.ReqAuthPublicKey} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.User>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.authPk =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/AuthPk',
      request,
      metadata || {},
      methodDescriptor_Bastion_AuthPk);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqSshUser,
 *   !proto.bastion.UserKb>}
 */
const methodDescriptor_Bastion_AuthKb = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/AuthKb',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqSshUser,
  proto.bastion.UserKb,
  /**
   * @param {!proto.bastion.ReqSshUser} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.UserKb.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqSshUser,
 *   !proto.bastion.UserKb>}
 */
const methodInfo_Bastion_AuthKb = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.UserKb,
  /**
   * @param {!proto.bastion.ReqSshUser} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.UserKb.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqSshUser} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.UserKb)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.UserKb>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.authKb =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/AuthKb',
      request,
      metadata || {},
      methodDescriptor_Bastion_AuthKb,
      callback);
};


/**
 * @param {!proto.bastion.ReqSshUser} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.UserKb>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.authKb =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/AuthKb',
      request,
      metadata || {},
      methodDescriptor_Bastion_AuthKb);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqAssetsQuery,
 *   !proto.bastion.AssetList>}
 */
const methodDescriptor_Bastion_FetchAsset = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/FetchAsset',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqAssetsQuery,
  proto.bastion.AssetList,
  /**
   * @param {!proto.bastion.ReqAssetsQuery} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.AssetList.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqAssetsQuery,
 *   !proto.bastion.AssetList>}
 */
const methodInfo_Bastion_FetchAsset = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.AssetList,
  /**
   * @param {!proto.bastion.ReqAssetsQuery} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.AssetList.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqAssetsQuery} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.AssetList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.AssetList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.fetchAsset =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/FetchAsset',
      request,
      metadata || {},
      methodDescriptor_Bastion_FetchAsset,
      callback);
};


/**
 * @param {!proto.bastion.ReqAssetsQuery} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.AssetList>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.fetchAsset =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/FetchAsset',
      request,
      metadata || {},
      methodDescriptor_Bastion_FetchAsset);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqAssetUser,
 *   !proto.bastion.AssetSshAccount>}
 */
const methodDescriptor_Bastion_FetchAssetSshConfig = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/FetchAssetSshConfig',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqAssetUser,
  proto.bastion.AssetSshAccount,
  /**
   * @param {!proto.bastion.ReqAssetUser} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.AssetSshAccount.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqAssetUser,
 *   !proto.bastion.AssetSshAccount>}
 */
const methodInfo_Bastion_FetchAssetSshConfig = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.AssetSshAccount,
  /**
   * @param {!proto.bastion.ReqAssetUser} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.AssetSshAccount.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqAssetUser} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.AssetSshAccount)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.AssetSshAccount>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.fetchAssetSshConfig =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/FetchAssetSshConfig',
      request,
      metadata || {},
      methodDescriptor_Bastion_FetchAssetSshConfig,
      callback);
};


/**
 * @param {!proto.bastion.ReqAssetUser} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.AssetSshAccount>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.fetchAssetSshConfig =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/FetchAssetSshConfig',
      request,
      metadata || {},
      methodDescriptor_Bastion_FetchAssetSshConfig);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqSshExec,
 *   !proto.bastion.ResStatus>}
 */
const methodDescriptor_Bastion_SshShellExec = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/SshShellExec',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqSshExec,
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqSshExec} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqSshExec,
 *   !proto.bastion.ResStatus>}
 */
const methodInfo_Bastion_SshShellExec = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqSshExec} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqSshExec} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.ResStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.ResStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.sshShellExec =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/SshShellExec',
      request,
      metadata || {},
      methodDescriptor_Bastion_SshShellExec,
      callback);
};


/**
 * @param {!proto.bastion.ReqSshExec} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.ResStatus>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.sshShellExec =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/SshShellExec',
      request,
      metadata || {},
      methodDescriptor_Bastion_SshShellExec);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqWebXterm,
 *   !proto.bastion.ResWebXterm>}
 */
const methodDescriptor_Bastion_WebXterm = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/WebXterm',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqWebXterm,
  proto.bastion.ResWebXterm,
  /**
   * @param {!proto.bastion.ReqWebXterm} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResWebXterm.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqWebXterm,
 *   !proto.bastion.ResWebXterm>}
 */
const methodInfo_Bastion_WebXterm = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.ResWebXterm,
  /**
   * @param {!proto.bastion.ReqWebXterm} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResWebXterm.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqWebXterm} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.ResWebXterm)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.ResWebXterm>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.webXterm =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/WebXterm',
      request,
      metadata || {},
      methodDescriptor_Bastion_WebXterm,
      callback);
};


/**
 * @param {!proto.bastion.ReqWebXterm} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.ResWebXterm>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.webXterm =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/WebXterm',
      request,
      metadata || {},
      methodDescriptor_Bastion_WebXterm);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqSshLog,
 *   !proto.bastion.ResStatus>}
 */
const methodDescriptor_Bastion_PushSshSessionLog = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/PushSshSessionLog',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqSshLog,
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqSshLog} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqSshLog,
 *   !proto.bastion.ResStatus>}
 */
const methodInfo_Bastion_PushSshSessionLog = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqSshLog} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqSshLog} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.ResStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.ResStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.pushSshSessionLog =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/PushSshSessionLog',
      request,
      metadata || {},
      methodDescriptor_Bastion_PushSshSessionLog,
      callback);
};


/**
 * @param {!proto.bastion.ReqSshLog} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.ResStatus>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.pushSshSessionLog =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/PushSshSessionLog',
      request,
      metadata || {},
      methodDescriptor_Bastion_PushSshSessionLog);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqSshCmd,
 *   !proto.bastion.ResStatus>}
 */
const methodDescriptor_Bastion_PushSshCmd = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/PushSshCmd',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqSshCmd,
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqSshCmd} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqSshCmd,
 *   !proto.bastion.ResStatus>}
 */
const methodInfo_Bastion_PushSshCmd = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqSshCmd} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqSshCmd} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.ResStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.ResStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.pushSshCmd =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/PushSshCmd',
      request,
      metadata || {},
      methodDescriptor_Bastion_PushSshCmd,
      callback);
};


/**
 * @param {!proto.bastion.ReqSshCmd} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.ResStatus>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.pushSshCmd =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/PushSshCmd',
      request,
      metadata || {},
      methodDescriptor_Bastion_PushSshCmd);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqAuthLog,
 *   !proto.bastion.ResStatus>}
 */
const methodDescriptor_Bastion_PushAuthLog = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/PushAuthLog',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqAuthLog,
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqAuthLog} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqAuthLog,
 *   !proto.bastion.ResStatus>}
 */
const methodInfo_Bastion_PushAuthLog = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqAuthLog} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqAuthLog} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.ResStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.ResStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.pushAuthLog =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/PushAuthLog',
      request,
      metadata || {},
      methodDescriptor_Bastion_PushAuthLog,
      callback);
};


/**
 * @param {!proto.bastion.ReqAuthLog} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.ResStatus>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.pushAuthLog =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/PushAuthLog',
      request,
      metadata || {},
      methodDescriptor_Bastion_PushAuthLog);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bastion.ReqAssetCmd,
 *   !proto.bastion.ResStatus>}
 */
const methodDescriptor_Bastion_RemoteExec = new grpc.web.MethodDescriptor(
  '/bastion.Bastion/RemoteExec',
  grpc.web.MethodType.UNARY,
  proto.bastion.ReqAssetCmd,
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqAssetCmd} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bastion.ReqAssetCmd,
 *   !proto.bastion.ResStatus>}
 */
const methodInfo_Bastion_RemoteExec = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bastion.ResStatus,
  /**
   * @param {!proto.bastion.ReqAssetCmd} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.bastion.ResStatus.deserializeBinary
);


/**
 * @param {!proto.bastion.ReqAssetCmd} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bastion.ResStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bastion.ResStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bastion.BastionClient.prototype.remoteExec =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bastion.Bastion/RemoteExec',
      request,
      metadata || {},
      methodDescriptor_Bastion_RemoteExec,
      callback);
};


/**
 * @param {!proto.bastion.ReqAssetCmd} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bastion.ResStatus>}
 *     Promise that resolves to the response
 */
proto.bastion.BastionPromiseClient.prototype.remoteExec =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bastion.Bastion/RemoteExec',
      request,
      metadata || {},
      methodDescriptor_Bastion_RemoteExec);
};


module.exports = proto.bastion;

